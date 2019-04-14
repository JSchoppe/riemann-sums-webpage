const viewHeight = 500;

const baseColor = "rgb(50, 50, 50)";
const xColor = "rgb(100, 25, 25)";
const yColor = "rgb(50, 50, 50)";



var canvas = document.querySelector("#output-graph").getContext("2d");

function drawGridViewport(minY, maxY, minX){
    canvas.clearRect(0, 0, viewHeight * 2, viewHeight)

    let ppu = viewHeight / (maxY - minY); // pixels per unit
    
    let offsetY = maxY - Math.floor(maxY);

    let i;
    for(i = Math.floor(maxY); i >= minY; i--){
        canvas.beginPath();
        canvas.moveTo(0, (maxY - i + offsetY) * ppu);
        canvas.lineTo(viewHeight * 2, (maxY - i + offsetY) * ppu)
        if (i == 0){
            canvas.strokeStyle = xColor;
            canvas.lineWidth = "4";
        }
        else{
            canvas.strokeStyle = baseColor;
            canvas.lineWidth = "2";
        }
        canvas.stroke();
    }
    
}

drawGridViewport(-15, 15, 0);