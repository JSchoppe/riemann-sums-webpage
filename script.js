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
    this.fillColor = "rgb(25, 25, 100)";
    
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
        this.context.fillStyle = this.fillColor;
        this.context.beginPath();
        this.context.fillRect(left, top, width, height);
        this.context.stroke();
    };
}


var graphA = new Graph2D(document.querySelector("#output-graph"));
graphA.minX = -1;
graphA.minY = -1;
graphA.drawGrid();
graphA.fillRegion(0,0,0.5,2);