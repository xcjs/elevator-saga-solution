{
    init: function(elevators, floors) {
        var lastSelectedElevator = -1;

        var directions = {
            down: 'down',
            up: 'up'
        };

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

        var getElevatorDirection = function(currentFloor, floorQueue) {
            if(currentFloor === 0 || floorQueue.length === 0) return directions.up;
            if(currentFloor === floors.length + 1) return directions.down;

            if(currentFloor < floorQueue[0]) return directions.up;
            else if(currentFloor > floorQueue[floorQueue.length - 1]) return directions.down;
            else {
                if(lastElevatorDirection === directions.down) {
                    lastElevatorDirection = directions.up;
                }
                else {
                    lastElevatorDirection = directions.down;  
                }

                return lastElevatorDirection; 
            }
        };

        var rearrangeQueue = function(currentFloor, floorQueue, dir) {
            if(floorQueue.length === 0) return;

            floorQueue.sort();

            var dir = getElevatorDirection(currentFloor, floorQueue);

            if(dir === directions.down) {
                floorQueue.reverse();
            } 
            
            var splitIndex = -1;

            var aboveFloors = [];
            var belowFloors = [];

            floorQueue.forEach(function(floor) {
                if(floor <= currentFloor) {
                    belowFloors.push(floor);
                } else {
                    aboveFloors.push(floor);
                }
            });            

            if(dir === directions.up) {
                floorQueue = aboveFloors.concat(belowFloors.reverse());
            } else {
                floorQueue = belowFloors.concat(aboveFloors.reverse());
            }
        };

        var setElevatorQueue = function(elevator) {
            var pressedFloors = elevator.getPressedFloors();
            var pos = elevator.currentFloor();

            if(pressedFloors.length === 0) return;            

            rearrangeQueue(pos, pressedFloors);
            elevator.checkDestinationQueue();
        };

        elevators.forEach(function(elevator) {
            // Whenever the elevator is idle (has no more queued destinations) ...       

            elevator.on("idle", function() {

            });

            elevator.on("floor_button_pressed", function(floorNum) {               
                elevator.goToFloor(floorNum);
                setElevatorQueue(elevator);
            });
        });

        floors.forEach(function(floor) {
            floor.on("up_button_pressed", function() {               
                var e = elevators[getElevator()];
                e.goToFloor(floor.floorNum());
                setElevatorQueue(e);
            });

            floor.on("down_button_pressed", function() {
                var e = elevators[getElevator()];
                e.goToFloor(floor.floorNum());
                setElevatorQueue(e);
            });
        });
    },

        update: function(dt, elevators, floors) {
            // We normally don't need to do anything here
        }   
}
