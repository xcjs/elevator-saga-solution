{
    init: function(elevators, floors) {
        var directions = {
            down: 'down',
            up: 'up',
            stopped: 'stopped'
        };

        var lastSelectedElevator = -1;
        var lastElevatorDirection = directions.up;

        var getElevator = function() {
            if(elevators.length === 1) {
                lastSelectedElevator = 0;
                return lastSelectedElevator;
            }
            
            if(lastSelectedElevator >= elevators.length - 1) {
                lastSelectedElevator = 0;    
            } else {
                lastSelectedElevator++;
            }

            if(elevators[lastSelectedElevator].loadFactor() === 1) {
                lastSelectedElevator = getElevator();
            }

            return lastSelectedElevator;
        };

        var rearrangeQueue = function(elevator) {
            var q = elevator.destinationQueue;
            var currentFloor = elevator.currentFloor();
            var dir = elevator.destinationDirection();

            if(q.length === 0) return;

            q.sort();

            if(dir === directions.down) q.reverse();
            
            var splitIndex = -1;

            var aboveFloors = [];
            var belowFloors = [];

            q.forEach(function(floor) {
                if(floor < currentFloor) {
                    belowFloors.push(floor);
                } else {
                    aboveFloors.push(floor);
                }
            });            

            if(dir === directions.up) {
                elevator.destinationQueue = aboveFloors.concat(belowFloors.reverse());
            } else {
                elevator.destinationQueue = belowFloors.concat(aboveFloors.reverse());
            }

            elevator.checkDestinationQueue();
        };

        elevators.forEach(function(elevator) {

            elevator.on("floor_button_pressed", function(floorNum) {               
                elevator.goToFloor(floorNum);
                rearrangeQueue(elevator);
            });
        });

        floors.forEach(function(floor) {
            floor.on("up_button_pressed", function() {               
                var e = elevators[getElevator()];
                e.goToFloor(floor.floorNum());
                rearrangeQueue(e);
            });

            floor.on("down_button_pressed", function() {
                var e = elevators[getElevator()];
                e.goToFloor(floor.floorNum());
                rearrangeQueue(e);
            });
        });
    },

    update: function(dt, elevators, floors) {
        // Do more stuff with the elevators and floors
        // dt is the number of game seconds that passed since the last time update was called
    }
}
