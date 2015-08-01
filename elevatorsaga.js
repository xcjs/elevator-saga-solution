{
    init: function(elevators, floors) {
        var directions = {
            up: 'up',
            down: 'down',
            stopped: 'stopped'
        };

        var splitToQueue = function(floorNum) {
            var elevator = getNearestElevator(floorNum);
            addToElevatorQueue(elevator, floorNum);
            setIndicator(elevator);
        };

        var addToElevatorQueue = function(elevator, floorNum) {
            if(elevator.destinationQueue.indexOf(floorNum) > -1) {
                return;
            }

            var dir = elevator.destinationDirection();
            var pos = elevator.currentFloor();
            var max = floors.length - 1;

            var nextFloor = getNextFloor(pos, dir, max);          

            if(floorNum === nextFloor) {
                elevator.goToFloor(floorNum);
                elevator.checkDestinationQueue();
                return;
            }

            elevator.destinationQueue.push(floorNum);
            elevator.destinationQueue.sort();

            var aboveFloors = [];
            var belowFloors = [];

            elevator.destinationQueue.forEach(function(item) {
                if(item > pos) {
                    aboveFloors.push(item);
                } else if (item <= pos) {
                    belowFloors.push(item);
                }
            });

            elevator.destinationQueue = [];
            belowFloors.reverse();

            if(dir === directions.up || dir === directions.stopped) {
                elevator.destinationQueue = elevator.destinationQueue.concat(aboveFloors.concat(belowFloors));
            } else {
                elevator.destinationQueue = elevator.destinationQueue.concat(belowFloors.concat(aboveFloors));
            }

            elevator.checkDestinationQueue();
        };

        var getNextFloor = function(pos, dir, max) {
            var nextFloor = null;

            if(pos === 0) {
                nextFloor = pos + 1;
            } else if(pos === max - 1) {
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

            var numFloors = floors.length;
            var distanceFactors = [];

            elevators.forEach(function(elevator) {
                var dir = elevator.destinationDirection();
                var currentFloor = elevator.currentFloor();

                if(elevator.loadFactor() === 0) {
                    distanceFactors.push(elevator.loadFactor());
                } else if(elevator.loadFactor() === 1) {
                    distanceFactors.push(numFloors * 2 + elevator.loadFactor());
                } else if(dir === directions.up) {
                    if(floorNum > currentFloor) {
                        distanceFactors.push(floorNum - currentFloor + elevator.loadFactor());
                    } else if(floorNum < currentFloor) {
                        distanceFactors.push(currentFloor - floorNum + numFloors + elevator.loadFactor());
                    } else { 
                        distanceFactors.push(elevator.loadFactor());
                    }
                } else if(dir === directions.down) {
                    if(floorNum < currentFloor) {
                        distanceFactors.push(currentFloor - floorNum + elevator.loadFactor());
                    } else if(floorNum > currentFloor) {
                        distanceFactors.push(floorNum - currentFloor + numFloors + elevator.loadFactor());
                    } else {
                        distanceFactors.push(elevator.loadFactor());
                    }
                } else {
                    distanceFactors.push(elevator.loadFactor());
                }
            });

            var min = Math.min.apply(Math, distanceFactors);
            var i = distanceFactors.indexOf(min);
            
            return i !== -1 ? elevators[i] : elevators[0];
        };

        var setIndicator = function(elevator) {
            var dir = elevator.destinationDirection();
            var pos = elevator.currentFloor();
            var maxPos = floors.length;

            var goingUp = function() {
                elevator.goingUpIndicator(true);
                elevator.goingDownIndicator(false);
            };

            var goingDown = function() {
                elevator.goingDownIndicator(true);
                elevator.goingUpIndicator(false);
            }

            var goingNowhere = function() {
                elevator.goingDownIndicator(true);
                elevator.goingUpIndicator(true);
            };

            if(pos === 0) {
                goingUp();
                return;
            }

            if (pos === maxPos - 1) {
                goingDown();
                return;
            }

            switch(dir) {
                default:
                    goingNowhere();
                    break;
                case directions.up:
                    goingUp();
                    break;
                case directions.down:
                    goingDown();
                    break;
            }
        }

        elevators.forEach(function(elevator) {
            elevator.on("floor_button_pressed", function(floorNum) {               
                addToElevatorQueue(elevator, floorNum);
            });

            elevator.on("idle", function() { 
                if(elevator.currentFloor > 1) {
                    elevator.goToFloor(Math.floor(floors.length / 2));
                }
                setIndicator(elevator);
            });

            elevator.on("passing_floor", function(floorNum, direction) {
                setIndicator(elevator);
            });

            elevator.on('stopped_at_floor', function(floorNum) {
                setIndicator(elevator);
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
    