{
    init: function (elevators, floors) {
        console.clear();
        const weight = 0.3;
        const maxFloor = floors.length - 1;

        const distance = function (floorNum) {
            return Math.abs(this.currentFloor() - floorNum);
        };

        const findIdle = function (floorNum) {
            return elevators.filter((elevator) => (elevator.destinationQueue.length == 0))
                .sort((a, b) => (a.distance(floorNum) - b.distance(floorNum)));
        };

        const controlUpDown = function () {
            const floorNum = this.currentFloor();
            const target = (this.destinationQueue.length > 0) ? this.destinationQueue[0] : floorNum;
            let up = true, down = true;
            switch (floorNum) {
                case 0:
                    down = false;
                    break;
                case maxFloor:
                    up = false;
                    break;
                default:
                    up = (target >= floorNum);
                    down = (target <= floorNum);
                    break;
            }
            this.goingUpIndicator(up);
            this.goingDownIndicator(down)
        };

        floors.forEach(function (floor) {
            floor.on("up_button_pressed down_button_pressed", function () {
                // find an idle elevator if possible
                let choice = findIdle(floor.floorNum());
                if (choice.length) {
                    let elevator = choice[0];
                    elevator.goToFloor(floor.floorNum());
                    elevator.controlUpDown();
                }
            });
        });

        elevators.forEach(function (elevator, index) {
            // add an identifier to each elevator
            elevator.id = index;
            elevator.controlUpDown = controlUpDown;
            elevator.distance = distance;

            // event if elevator is doing nothing...
            elevator.on("idle", function () {

                // see if any floors have buttons pressed
                // TODO: choose better
                let demand = floors.filter((floor) => (floor.buttonStates.up || floor.buttonStates.down));

                // choose the first one
                if (demand.length) {
                    target = demand[0].floorNum();
                } else {
                    target = 0;
                }

                elevator.goToFloor(target);
            });

            // floor button pressed in elevator
            elevator.on("floor_button_pressed", function (floorNum) {
                const target = floorNum;
                elevator.goToFloor(target);
                elevator.controlUpDown();

            });

            elevator.on("passing_floor", function (floorNum, direction) {
                const floor = floors[floorNum];
                const pressed = elevator.getPressedFloors();
                const stop = floor.buttonStates[direction] && (elevator.loadFactor() < weight);
                // if we're going in the same direction as the button, we can stop
                if (stop || (pressed.indexOf(floorNum) >= 0)) {
                    // remove this floor from destinations
                    elevator.destinationQueue = elevator.destinationQueue.filter((d) => (d !== floorNum));
                    // no need to call checkDestinationQueue as done in here...
                    elevator.goToFloor(floorNum, true);
                }

            });
            elevator.on("stopped_at_floor", function (floorNum) {
                // do something here
                // control up and down indicators
                elevator.controlUpDown();

            });
        });

    }
,

    update: function (dt, elevators, floors) {
        // We normally don't need to do anything here
    }
}