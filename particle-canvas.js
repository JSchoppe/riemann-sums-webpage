
const frameStep = 1/90;


var canvasContext = document.querySelector("#background").getContext("2d");
var emitters = [];
function update(){
    canvasContext.clearRect(0, 0, 5000, 5000)
    emitters.forEach(function(emitter){
        emitter.update(frameStep);
    });
}

// Particle Behaviors
function snowParticle(emitter){

    this.parent = emitter;

    this.posY = 0;

    // set default values
    this.weight = 200; // controls how fast the particle falls
    this.size = 1; // controls the radius of the particle
    

    this.update = function(deltaTime){
        this.posY += this.weight * deltaTime;

        if (this.posY > 400){

            for(var i = 0; i < emitter.particles.length; i++){ 
                if ( emitter.particles[i] === this) {
                    emitter.particles.splice(i, 1); 
                }
             }
        }else{
            canvasContext.moveTo(250, this.posY);
            canvasContext.fillStyle = "rgb(0,55,0)";
            canvasContext.beginPath();
            canvasContext.arc(250, this.posY, 50, 0, 2 * Math.PI);
            canvasContext.fill();
        }
    }

}

// Particle Emitters
function barEmitter(length){
    this.secondsPerParticle = 0.8;
    this.timePassed = 0;

    this.particles = [];

    this.update = function(deltaTime){
        this.timePassed += deltaTime;
        if (this.timePassed > this.secondsPerParticle){
            this.emit();
            this.timePassed = 0;
        }

        this.particles.forEach(function(particle){
            particle.update(deltaTime);
        })
    }

    this.emit = function(){
        this.particles.push(new snowParticle(this));
    }
}

emitters.push(new barEmitter(5));
window.setInterval(update, frameStep * 1000);