{
    init: function(elevators, floors) {
        var directions = {
            up: 'up',
            down: 'down',
            stopped: 'stopped'
        };

        var splitToQueue = function(floorNum) {
            var elevator = getNearestElevator();
            addToElevatorQueue(elevator, floorNum);
        };

        var addToElevatorQueue = function(elevator, floorNum) {
            var dir = elevator.destinationDirection();
            var pos = elevator.currentFloor();
            var max = floors.length - 1;

            var nextFloor = getNextFloor(pos, dir, max);          

            if(floorNum === nextFloor) {
                elevator.goToFloor(floorNum, true);
                return;
            }

            elevator.destinationQueue.push(floorNum);
            elevator.destinationQueue.sort();

            var aboveFloors = [];
            var belowFloors = [];

            elevator.destinationQueue.forEach(function(item) {
                if(item > pos) {
                    aboveFloors.push(item);
                } else if (item < pos) {
                    belowFloors.push(item);
                }
            });

            elevator.destinationQueue = [];
            belowFloors.reverse();

            if(dir === directions.up || dir === directions.stopped) {)
                elevator.destinationQueue = elevator.destinationQueue.concat(aboveFloors.concat(belowFloors));
            } else {
                elevator.destinationQueue = elevator.destinationQueue.concat(belowFloors.concat(aboveFloors))
            }

            console.log(elevator.destinationQueue);
            elevator.checkDestinationQueue();
        };

        var getNextFloor = function(pos, dir, max) {
            var nextFloor = null;

            if(pos === 0) {
                nextFloor = pos + 1;
            } else if(pos === max) {
                nextFloor = max;
            } else if(dir === directions.up) {
                nextFloor = Math.floor(pos) + 1;
                if(nextFloor > max) nextFloor = max;
            } else if(dir === directions.down) {
                nextFloor = Math.floor(pos) - 1;
                if(nextFloor < 0) nextFloor = 1;
            }

            return nextFloor;
        }

        var getNearestElevator = function(floorNum) {
            if(elevators.length === 1) return elevators[0];            
        };

        var getElevatorDistances = function(floorNum) {
            var lap = floors.length;
            var factor = 0;
            var factors = [];

            elevators.forEach(function(e, i) {

            });

            return factors;
        };

        elevators.forEach(function(elevator) {
            elevator.on("floor_button_pressed", function(floorNum) {               
                addToElevatorQueue(elevator, floorNum);
            });
        });

        floors.forEach(function(floor) {
            floor.on("up_button_pressed", function() {               
                splitToQueue(floor.floorNum());
            });

            floor.on("down_button_pressed", function() {
                splitToQueue(floor.floorNum());
            });
        });
    },

    update: function(dt, elevators, floors) {
        // Do more stuff with the elevators and floors
        // dt is the number of game seconds that passed since the last time update was called
    }
}
    