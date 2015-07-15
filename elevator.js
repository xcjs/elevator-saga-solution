{
    init: function(elevators, floors) {
        var lastSelectedElevator = -1;
        
        var getElevator = function() {
            if(lastSelectedElevator >= elevators.length - 1) {
                lastSelectedElevator = 0;    
            } else {
                lastSelectedElevator++;
            }
            
            return lastSelectedElevator;
        };       
        
        elevators.forEach(function(elevator) {
            // Whenever the elevator is idle (has no more queued destinations) ...
            elevator.on("idle", function() {

            });

            elevator.on("floor_button_pressed", function(floorNum) {            
                elevator.goToFloor(floorNum, true);
            });
        });

        floors.forEach(function(floor) {
            floor.on("up_button_pressed", function() {               
                elevators[getElevator()].goToFloor(floor.floorNum());
            });

            floor.on("down_button_pressed", function() {
                elevators[getElevator()].goToFloor(floor.floorNum());
            });
        });
    },
    update: function(dt, elevators, floors) {
        // We normally don't need to do anything here
    }
}
