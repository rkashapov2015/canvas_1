'use strict';
var canvasNode = document.getElementById('MyCanvas');
(function (d, w) {

    const PI = Math.PI;
    const ctx = canvasNode.getContext('2d');
    var width = canvasNode.width;
    var height = canvasNode.height;
    let array = [];
    let hue = 0;

    w.addEventListener('resize', (event) => {
        clearCanvas();
        resizeCanvas();
    })

    function clearCanvas() {
        ctx.clearRect(0, 0, canvasNode.width,canvasNode.height);
        
    }
    function resizeCanvas() {
        let w = window.innerWidth;
        let h = window.innerHeight;
        canvasNode.style.width = w-5 + 'px';
        canvasNode.style.height = h-5 + 'px';
        canvasNode.width = w;
        canvasNode.height = h;
      }

    function randomMinMax(min, max, divider) {
        if (!divider) divider = 1;
        let rand = (min + (Math.random() * (max + 0.01 - min)));
        return Math.floor(rand*divider)/divider;
    }

    function init() {
        resizeCanvas();
        
        for (let i = 0; i < 1000; i++) {
            let x = Math.floor(Math.random() * canvasNode.width);
            let y = Math.floor(Math.random() * canvasNode.height);
            let z = Math.floor(Math.random() * canvasNode.height);
            let angle = (Math.random() * 359)

            array[i] = {
                x: x, 
                y: y,
                z: z,
                angle: angle
            };
        }
        tick();
    }

    function tick() {
        let width = canvasNode.width;
        let height = canvasNode.height;

        ctx.beginPath();
        
        array.forEach(function (value) {
            let newX = 2;
            let newY = 0;
            //let angle = randomMinMax(0, 359, 1);

            if (value.x > width) {
                value.x = 0;
            }
            if (value.y > height) {
                value.y = 0;
            }
            noise.seed(0);
            let rad = getRadians(value.angle);
            
            let dop = Math.max(noise.perlin2(value.x / 100, value.y / 100));
            
            let radians =  rad + dop;
            newX = 2 * Math.cos(radians) - 0 * Math.sin(radians);
            newX = value.x + newX;
            newY = 2 * Math.sin(radians) + 0 * Math.cos(radians);
            newY = value.y + newY;
            

            drawLine(ctx, value.x, value.y, newX, newY);

            value.x = newX;
            value.y = newY;
            //blur()
            //console.log(value.x, value.y, newX, newY);
        });
        ctx.globalCompositeOperation = 'source-over';
        ctx.fillStyle = 'rgba(0,0,0,0.085)';
        ctx.fillRect(0, 0, width, height);
        ctx.globalCompositeOperation = 'lighter';
        ctx.strokeStyle = 'hsla(' + hue + ', 75%, 50%, .55)';
        
        ctx.stroke();
        ctx.closePath();
        hue = ((hue + .5) % 360);
        w.requestAnimationFrame(tick);
    }
    
    function blur() {
        ctx.globalAlpha = 0.5;
        ctx.fillRect(0,0,canvasNode.width,canvasNode.height);
    }

    function getRadians(angle) {
        return angle * (PI/180);
    }

    function drawLine(ctx, sX, sY, eX, eY) {
        ctx.save();
        //ctx.beginPath();
        ctx.moveTo(sX, sY);
        ctx.lineTo(eX, eY);
        //ctx.strokeStyle = '#ffffff';
        //ctx.closePath();
        
        //ctx.restore();
    }
    init();
})(document, window);
