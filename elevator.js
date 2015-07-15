{
    init: function(elevators, floors) {
        var getRandomIntInclusive = function(min, max) {
            return Math.floor(Math.random() * (max - min + 1)) + min;
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
                // Maybe tell an elevator to go to this floor?
                elevators[getRandomIntInclusive(0, elevators.length - 1)].goToFloor(floor.floorNum());
            });

            floor.on("down_button_pressed", function() {
                // Maybe tell an elevator to go to this floor?
                elevators[getRandomIntInclusive(0, elevators.length - 1)].goToFloor(floor.floorNum());
            });
        });
    },
    update: function(dt, elevators, floors) {
        // We normally don't need to do anything here
    }
}
