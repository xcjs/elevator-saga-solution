{
    init: function(elevators, floors) {
        var lastSelectedElevator = -1;

        var directions = {
            down: 'down',
            up: 'up'
        };

        var lastElevatorDirection = directions.down;



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

            return lastSelectedElevator;
        };

        var getElevatorDirection = function() {
            lastElevatorDirection;

            if(lastElevatorDirection === directions.down) {
                lastElevatorDirection = directions.up;
            } else {
                lastElevatorDirection = directions.down;
            }

            return lastElevatorDirection;
        };

        var rearrangeQueue = function(currentFloor, floorQueue, dir) {
            if(floorQueue.length === 0) return [];

            floorQueue.sort();

            var dir = getElevatorDirection();

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
