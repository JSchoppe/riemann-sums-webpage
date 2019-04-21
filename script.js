"use strict";
const viewHeight = 500;

//
// Object Definitions
//

// Constructs a 2D graph object which outputs to a canvas element:
function Graph2D(canvasElement){
    // Retrieve neccasary references:
    this.context = canvasElement.getContext("2d");

    // Set default values:
    this.minX = -10;
    this.maxX = 10;
    this.minY = -10;
    this.maxY = 10;
    this.baseColor = "rgb(50, 50, 50)";
    this.xColor = "rgb(100, 25, 25)";
    this.yColor = "rgb(25, 100, 25)";
    this.funcColor = "rgb(255, 255, 255)";
    this.riemannColor1 = "rgb(0,100,255)";
    this.riemannColor2 = "rgb(0,255,100)";
    
    // Draws the viewport grid and clears any previous content:
    this.drawGrid = function(){
        this.context.clearRect(0, 0, viewHeight * 2, viewHeight);

        let ppuY = viewHeight / (this.maxY - this.minY); // pixels per unit
        let ppuX = (viewHeight * 2) / (this.maxX - this.minX);

        let i;
        for(i = Math.ceil(this.minX); i <= this.maxX; i++){ // draw vertical lines from left to right
            if (i != 0){
                this.context.beginPath();
                this.context.moveTo(-(this.minX - i) * ppuX, 0);
                this.context.lineTo(-(this.minX - i) * ppuX, viewHeight)
                this.context.strokeStyle = this.baseColor;
                this.context.lineWidth = "2";
                this.context.stroke();
            }
        }
        for(i = Math.floor(this.maxY); i >= this.minY; i--){ // draw horizontal lines from top to bottom
            if (i != 0){
                this.context.beginPath();
                this.context.moveTo(0, (this.maxY - i) * ppuY);
                this.context.lineTo(viewHeight * 2, (this.maxY - i) * ppuY)
                this.context.strokeStyle = this.baseColor;
                this.context.lineWidth = "2";
                this.context.stroke();
            }
        }
        if (this.minX <= 0){ // if the X axis is inside the viewport, draw it
            this.context.beginPath();
            this.context.moveTo(-(this.minX) * ppuX, 0);
            this.context.lineTo(-(this.minX) * ppuX, viewHeight);
            this.context.strokeStyle = this.yColor;
            this.context.lineWidth = "4";
            this.context.stroke();
        }
        if (this.minY <= 0){ // if the Y axis is inside the viewport, draw it
            this.context.beginPath();
            this.context.moveTo(0, this.maxY * ppuY);
            this.context.lineTo(viewHeight * 2, this.maxY * ppuY);
            this.context.strokeStyle = this.xColor;
            this.context.lineWidth = "4";
            this.context.stroke();
        }
    };

    // Fills a rectangular region based on coordinated:
    this.fillRegion = function(x1, y1, x2, y2){
        let ppuX = (viewHeight * 2) / (this.maxX - this.minX); // pixels per unit
        let ppuY = viewHeight / (this.maxY - this.minY);

        let width = ppuX * (x2 - x1);
        let height = ppuY * (y2 - y1);
        let left = (x1 - this.minX) * ppuX;
        let top = -(y2 - this.maxY) * ppuY;

        this.context.lineWidth = "1";
        this.context.beginPath();
        this.context.fillRect(left, top, width, height);
        this.context.stroke();
    };

    // Draws a second degree parabola:
    this.drawParabola = function(translateX, translateY, scaleX, scaleY){
        let ppuX = (viewHeight * 2) / (this.maxX - this.minX); // pixels per unit
        let ppuY = viewHeight / (this.maxY - this.minY);
        let unitStep = (this.maxX - this.minX) / (viewHeight * 2); // units per pixel
        
        this.context.strokeStyle = this.funcColor;
        this.context.moveTo(0, -(Math.pow(this.minX, 2) - this.maxY) * ppuY);
        this.context.beginPath();

        let currentStep = this.minX;
        while(currentStep <= this.maxX){ // iterate along the x axis, one pixel at a time to draw the continuous function
            let nextX = (currentStep - this.minX) * ppuX;
            let nextY = (this.maxY - ((Math.pow((1/scaleX) * (currentStep - translateX), 2) * scaleY) + translateY)) * ppuY;

            this.context.lineTo(nextX, nextY);
            currentStep += unitStep; // step one pixel along the x-axis
        }
        this.context.stroke();
    };
    // Draws riemann regions for the parabola function:
    this.drawRiemannSumParabola = function(translateX, translateY, scaleX, scaleY, partitions, XrangeMin, XrangeMax, entireOutput){
        let partitionStep = (XrangeMax - XrangeMin) / (partitions + 1); // units per partition region

        let areaCalculation = "";
        let totalArea = 0;

        let currentStep = XrangeMin;
        let flipFlop = false;
        let i;
        for(i = 0; i <= partitions; i++){ // draw each partition
            let partitionY = ((Math.pow((1/scaleX) * (currentStep - translateX), 2) * scaleY) + translateY);

            flipFlop = !flipFlop; // alternate colors of partitions
            if (flipFlop){
                this.context.fillStyle = this.riemannColor1;
            }else{
                this.context.fillStyle = this.riemannColor2;
            }
            this.fillRegion(currentStep, 0, currentStep + partitionStep, partitionY);

            totalArea += partitionY; // update info for output
            if (entireOutput){
                areaCalculation += " + (" + partitionStep.toFixed(4) + " * " + partitionY.toFixed(4) + ")";
            }

            currentStep += partitionStep; // step to the next partition
        }

        totalArea = totalArea * partitionStep; // multiple the final sum by the partition width
        areaCalculation = totalArea.toFixed(8) + " = " + areaCalculation;

        if(entireOutput){ // return an output based on what was requested
            return areaCalculation;
        }
        else{
            return totalArea.toFixed(8);
        }
    };

    // Draws half a circle on the positive side of the x axis:
    this.drawSemiCircle = function(radius){
        let ppuX = (viewHeight * 2) / (this.maxX - this.minX); // pixels per unit
        let ppuY = viewHeight / (this.maxY - this.minY);
        let unitStep = (this.maxX - this.minX) / (viewHeight * 2); // units per pixel

        this.context.strokeStyle = this.funcColor;
        this.context.moveTo((-this.minX - radius) * ppuX, this.maxY * ppuY);
        this.context.beginPath();

        let currentStep = (-radius) // start at the left quadrant point of the circle
        while(currentStep <= radius){ // iteratively draw the function one pixel step at a time
            let nextX = (currentStep - this.minX) * ppuX;
            let nextY = (this.maxY - Math.sqrt(radius * radius - currentStep * currentStep)) * ppuY;
            this.context.lineTo(nextX, nextY);

            currentStep += unitStep; // step one pixel along the x-axis
        }
        this.context.stroke();
    };
    // Draws riemann regions for the circle function:
    this.drawRiemannSumSemiCircle = function(radius, partitions){
        let partitionStep = (2 * radius) / (partitions + 1); // units per partition region

        let totalArea = 0;
        let currentStep = -radius;
        let flipFlop = false;
        let i;
        for(i = 0; i <= partitions; i++){ // draw the partition regions from left to right
            let partitionY = Math.sqrt(radius * radius - currentStep * currentStep);

            flipFlop = !flipFlop; // alternate region colors
            if (flipFlop){
                this.context.fillStyle = this.riemannColor1;
            }else{
                this.context.fillStyle = this.riemannColor2;
            }
            this.fillRegion(currentStep, 0, currentStep + partitionStep, partitionY);

            totalArea += partitionY;
            currentStep += partitionStep;
        }

        totalArea = totalArea * partitionStep; // calculate and return total area(full string not implemented)
        return totalArea.toFixed(8);
    };

    // Draws the untransformed sine wave:
    this.drawSinWave = function(){
        let ppuX = (viewHeight * 2) / (this.maxX - this.minX); // pixels per unit
        let ppuY = viewHeight / (this.maxY - this.minY);
        let unitStep = (this.maxX - this.minX) / (viewHeight * 2); // units per pixel
        
        this.context.strokeStyle = this.funcColor;
        this.context.moveTo(0, (this.maxY - Math.sin(this.minX)) * ppuY);
        this.context.beginPath();

        let currentStep = this.minX;
        while(currentStep <= this.maxX){ // iterate along the x axis, one pixel at a time to draw the continuous function
            let nextX = (currentStep - this.minX) * ppuX;
            let nextY = (this.maxY - Math.sin(currentStep)) * ppuY;

            this.context.lineTo(nextX, nextY);
            currentStep += unitStep; // step one pixel along the x-axis
        }
        this.context.stroke();
    };
    // Draws reimann regions for the sine wave:
    this.drawRiemannSumSinWave = function(partitions, XrangeMin, XrangeMax){
        let partitionStep = (XrangeMax - XrangeMin) / (partitions + 1); // units per partition region

        let totalArea = 0;
        let currentStep = XrangeMin;
        let flipFlop = false;
        let i;
        for(i = 0; i <= partitions; i++){ // draw each partition
            let partitionY = Math.sin(currentStep);

            flipFlop = !flipFlop; // alternate colors of partitions
            if (flipFlop){
                this.context.fillStyle = this.riemannColor1;
            }else{
                this.context.fillStyle = this.riemannColor2;
            }
            this.fillRegion(currentStep, 0, currentStep + partitionStep, partitionY);

            totalArea += partitionY;
            currentStep += partitionStep; // step to the next partition
        }

        totalArea = totalArea * partitionStep; // multiple the final sum by the partition width
        return totalArea.toFixed(8);
    };
};

//
// Riemann Sum Interaction Logic
//

// Allow the page vertical scrolling to be locked/unlocked:
var scrollFrozen = false;
var frozenPosition = 0;
// Bind this to the window scroll event:
function onScroll(){
    if (scrollFrozen){
        window.scrollTo(0, frozenPosition);
    }
};
// Call once when the scrolling should be frozen:
function freezeScroll(){
    frozenPosition = window.scrollY;
    scrollFrozen = true;
};
// Call once when the scrolling should be unfrozen:
function unfreezeScroll(){
    scrollFrozen = false;
};

// Bind the first slider to update the contents of graph B:
var sumSlider = document.querySelector("#sum-slider");
var sumOut = document.querySelector("#sum-output");
sumSlider.oninput = function(){
    graphB.drawGrid();
    sumOut.innerHTML = graphB.drawRiemannSumParabola(0,4,2,-1, Math.round(this.value), -4 ,4, true);
    graphB.drawParabola(0,4,2,-1);
};

// Bind the exit page button:
document.querySelector("#anti-activity-button").addEventListener("click", () => {
    window.close();
});

// Define logic for the activity:
var activityOpen = false;
var currentGraphFunction = 1;
var currentPartitions = 1;
var background = document.querySelector("#activity-bg");
var activityGraph = new Graph2D(document.querySelector("#output-graph3"));
var activityInfo = document.querySelector("#activity-info");
// Bind button to open the modal activity:
document.querySelector("#activity-button").addEventListener("click", () => {
    if (!activityOpen){
        background.classList.remove("activity-hidden");
        activityOpen = true;
        freezeScroll();
    }
});
// Redraws the activity graph:
function redrawActivity(){
    switch(currentGraphFunction){ // draw a different function based on the current graph
        case 1:
            activityGraph.minX = -6;
            activityGraph.maxX = 6;
            activityGraph.minY = -1;
            activityGraph.maxY = 5;
            activityGraph.drawGrid();
            let areaA = activityGraph.drawRiemannSumParabola(0,4,2,-1, currentPartitions, -4 ,4, false);
            activityInfo.innerHTML = "Function: Parabola | Partitions: " + currentPartitions + " | Riemann Area: " + areaA + " | True Area: (64/3) = 21.33333333";
            activityGraph.drawParabola(0,4,2,-1);
            break;
        case 2:
            activityGraph.minX = -3;
            activityGraph.maxX = 3;
            activityGraph.minY = -1;
            activityGraph.maxY = 3;
            activityGraph.drawGrid();
            let areaB = activityGraph.drawRiemannSumSemiCircle(2, currentPartitions);
            activityInfo.innerHTML = "Function: Circle | Partitions: " + currentPartitions + " | Riemann Area: " + areaB + " | True Area: (2pi) = 6.28318531";
            activityGraph.drawSemiCircle(2);
            break;
        case 3:
            activityGraph.minX = -1;
            activityGraph.maxX = 6;
            activityGraph.minY = -2;
            activityGraph.maxY = 2;
            activityGraph.drawGrid();
            let areaC = activityGraph.drawRiemannSumSinWave(currentPartitions, 0, Math.PI);
            activityInfo.innerHTML = "Function: Sin | Partitions: " + currentPartitions + " | Riemann Area: " + areaC + " | True Area: 2";
            activityGraph.drawSinWave();
            break;
    }
};
// Handle keystroke input for the activity:
document.body.addEventListener("keydown", (e) => {
    if (activityOpen){ // ignore keystrokes when activity is closed
        switch(e.keyCode){
            case 27: // esc
                background.classList.add("activity-hidden");
                activityOpen = false;
                unfreezeScroll();
                break;
            case 37: // left
                if (currentGraphFunction > 1){
                    currentGraphFunction--;
                    redrawActivity();
                }
                break;
            case 39: // right
                if (currentGraphFunction < 3){
                    currentGraphFunction++;
                    redrawActivity();
                }
                break;
            case 38: // up
                if (currentPartitions < 1000){
                    currentPartitions++;
                    redrawActivity();
                }
                break;
            case 40: // down
                if (currentPartitions > 1){
                    currentPartitions--;
                    redrawActivity();
                }
                break;
        }
    }
});

//
// Initialize Page Objects
//

var graphA = new Graph2D(document.querySelector("#output-graph"));
graphA.minX = -6;
graphA.maxX = 6;
graphA.minY = -1;
graphA.maxY = 5;
graphA.drawGrid();
graphA.drawParabola(0,4,2,-1);

var graphB = new Graph2D(document.querySelector("#output-graph2"));
graphB.minX = -6;
graphB.maxX = 6;
graphB.minY = -1;
graphB.maxY = 5;
graphB.drawGrid();
graphB.drawRiemannSumParabola(0,4,2,-1, 9, -4 ,4, false);
graphB.drawParabola(0,4,2,-1);

window.addEventListener("scroll", onScroll);

redrawActivity();