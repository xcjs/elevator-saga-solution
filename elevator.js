{
    init: function(elevators, floors) {
        var elevator = elevators[0]; // Let's use the first elevator

        floors.forEach(function(floor) {
            floor.on("up_button_pressed", function() {
                // Maybe tell an elevator to go to this floor?
                elevator.goToFloor(floor.floorNum());
            });

            floor.on("down_button_pressed", function() {
                // Maybe tell an elevator to go to this floor?
                elevator.goToFloor(floor.floorNum());
            });
        });
        
        // Whenever the elevator is idle (has no more queued destinations) ...
        elevator.on("idle", function() {
            
        });
        
        elevator.on("floor_button_pressed", function(floorNum) {            
            elevator.goToFloor(floorNum, true);
        });
    },
    update: function(dt, elevators, floors) {
        // We normally don't need to do anything here
    }
}
