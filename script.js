const viewHeight = 500;

// Constructs a 2D graph object which outputs to a canvas element
function Graph2D(canvasElement){
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
    
    this.drawGrid = function(){
        this.context.clearRect(0, 0, viewHeight * 2, viewHeight)

        let ppuY = viewHeight / (this.maxY - this.minY); // pixels per unit
        let ppuX = (viewHeight * 2) / (this.maxX - this.minX);

        let i;
        for(i = Math.ceil(this.minX); i <= this.maxX; i++){
            if (i != 0){
                this.context.beginPath();
                this.context.moveTo(-(this.minX - i) * ppuX, 0);
                this.context.lineTo(-(this.minX - i) * ppuX, viewHeight)
                this.context.strokeStyle = this.baseColor;
                this.context.lineWidth = "2";
                this.context.stroke();
            }
        }
        for(i = Math.floor(this.maxY); i >= this.minY; i--){
            if (i != 0){
                this.context.beginPath();
                this.context.moveTo(0, (this.maxY - i) * ppuY);
                this.context.lineTo(viewHeight * 2, (this.maxY - i) * ppuY)
                this.context.strokeStyle = this.baseColor;
                this.context.lineWidth = "2";
                this.context.stroke();
            }
        }
        if (this.minX <= 0){
            this.context.beginPath();
            this.context.moveTo(-(this.minX) * ppuX, 0);
            this.context.lineTo(-(this.minX) * ppuX, viewHeight);
            this.context.strokeStyle = this.yColor;
            this.context.lineWidth = "4";
            this.context.stroke();
        }
        if (this.minY <= 0){
            this.context.beginPath();
            this.context.moveTo(0, this.maxY * ppuY);
            this.context.lineTo(viewHeight * 2, this.maxY * ppuY);
            this.context.strokeStyle = this.xColor;
            this.context.lineWidth = "4";
            this.context.stroke();
        }
    };

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

    this.drawParabola = function(translateX, translateY, scaleX, scaleY){
        let ppuX = (viewHeight * 2) / (this.maxX - this.minX); // pixels per unit
        let ppuY = viewHeight / (this.maxY - this.minY);
        let unitStep = (this.maxX - this.minX) / (viewHeight * 2); // units per pixel
        
        this.context.strokeStyle = this.funcColor;
        this.context.moveTo(0, -(Math.pow(this.minX, 2) - this.maxY) * ppuY);
        this.context.beginPath();

        let currentStep = this.minX;
        while(currentStep <= this.maxX){
            let nextX = (currentStep - this.minX) * ppuX;
            // TODO extract the process of converting pixel/unit space
            let nextY = (this.maxY - ((Math.pow((1/scaleX) * (currentStep - translateX), 2) * scaleY) + translateY)) * ppuY;

            this.context.lineTo(nextX, nextY);


            currentStep += unitStep; // step one pixel along the x-axis
        }
        this.context.stroke();
    };
    this.drawRiemannSumParabola = function(translateX, translateY, scaleX, scaleY, partitions, XrangeMin, XrangeMax){
        let partitionStep = (XrangeMax - XrangeMin) / (partitions + 1); // units per partition region

        let flipFlop = false;

        let areaCalculation = "";
        let totalArea = 0;

        let currentStep = XrangeMin;
        let i;
        for(i = 0; i <= partitions; i++){
            let partitionY = ((Math.pow((1/scaleX) * (currentStep - translateX + (partitionStep / 2)), 2) * scaleY) + translateY);

            flipFlop = !flipFlop;
            if (flipFlop){
                this.context.fillStyle = this.riemannColor1;
            }else{
                this.context.fillStyle = this.riemannColor2;
            }

            this.fillRegion(currentStep, 0, currentStep + partitionStep, partitionY);

            totalArea += partitionY;
            areaCalculation += " + (" + partitionStep.toFixed(4) + " * " + partitionY.toFixed(4) + ")";
            currentStep += partitionStep;
        }

        totalArea = totalArea * partitionStep;
        areaCalculation = totalArea.toFixed(8) + " =" + areaCalculation;
        return areaCalculation;
    };
}



// Define page logic

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
graphB.drawRiemannSumParabola(0,4,2,-1, 9, -4 ,4);
graphB.drawParabola(0,4,2,-1);

document.querySelector("#sum-slider").oninput = function() {
    graphB.drawGrid();
    document.querySelector("#sum-output").innerHTML = graphB.drawRiemannSumParabola(0,4,2,-1, Math.round(this.value), -4 ,4);
    graphB.drawParabola(0,4,2,-1);
};

var graphC = new Graph2D(document.querySelector("#background"));
graphC.minX = -50;
graphC.maxX = 50;
graphC.minY = -25;
graphC.maxY = 25;
graphC.drawGrid();