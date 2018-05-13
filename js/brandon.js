{
    init: function (elevators, floors) {
        console.clear();
        const weight = 0.2;
        let next = [];

        function next_scrub(floor) {
            return (next[0] === floor) ? next.slice(1).filter(item => (item !== floor)) : next;
        }

        floors.forEach(function (floor) {
            floor.on("up_button_pressed", function () {
                next.push(floor.level);
            });
            floor.on("down_button_pressed", function () {
                next.push(floor.level);
            });
        });

        elevators.forEach(function (elevator, index) {
            elevator.id = index;
            elevator.on("idle", function () {
                let target = 0;
                if (next.length > 0) {
                    target = next[0];
                    next = next_scrub(target);
                }
                elevator.goToFloor(target);

            });
            elevator.on("floor_button_pressed", function (floor) {
                let places = elevator.getPressedFloors();
                let cf = elevator.currentFloor();
                let z = places.findIndex(place => cf <= place);
                if (z >= 0) {
                    elevator.destinationQueue = places.splice(z).concat(places.splice(0, z).reverse());
                    elevator.checkDestinationQueue();
                }

                next = next_scrub(floor);
            });
            elevator.on("passing_floor", function (floorNum, direction) {
                let floor = floors[floorNum];

                if (floor.buttonStates[direction] && elevator.loadFactor() < weight) {
                    elevator.goToFloor(floorNum, true);
                    next = next_scrub(floorNum);
                }

            });
            elevator.on("stopped_at_floor", function (floorNum) {
                next = next_scrub(floorNum);
            });
        });

    }
,

    update: function (dt, elevators, floors) {
        // We normally don't need to do anything here
    }
}