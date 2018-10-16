'use strict';
var canvasNode = document.getElementById('MyCanvas');
(function (d, w) {

    const PI = Math.PI;
    const ctx = canvasNode.getContext('2d');
    var width = canvasNode.width;
    var height = canvasNode.height;
    let array = [];
    let magnits = [];
    let hue = 0;

    let Magnit = function Magnit(x, y, power) {
        this.set(x, y, power);
    }, mp = Magnit.prototype;

    mp.set = function(x, y, power) {
        this.x = x;
        this.y = y;
        this.power = power;

        return true;
    }

    w.addEventListener('resize', (event) => {
        clearCanvas();
        resizeCanvas();
    })

    function clearCanvas() {
        ctx.clearRect(0, 0, canvasNode.width,canvasNode.height);
        
    }
    function resizeCanvas() {
        noise.seed(Math.round(Math.random() * 65000));
        let w = window.innerWidth;
        let h = window.innerHeight;
        canvasNode.style.width = w-5 + 'px';
        canvasNode.style.height = h-5 + 'px';
        canvasNode.width = w;
        canvasNode.height = h;

        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, w, h);
      }

    function randomMinMax(min, max, divider) {
        if (!divider) divider = 1;
        let rand = (min + (Math.random() * (max + 0.01 - min)));
        return Math.floor(rand*divider)/divider;
    }

    function init() {
        resizeCanvas();

        let m_width = canvasNode.width/2;
        let m_height = canvasNode.height/2;

        //magnit_point = new Magnit(m_width, m_height, 100);
        

        /*for (let j = 0; j< 20;j++) {
            let mx = Math.floor(Math.random() * canvasNode.width);
            let my = Math.floor(Math.random() * canvasNode.height);
            magnits[j] = new Magnit(mx, my,  randomMinMax(50, 200,1));
        }*/
        
        // 0	200
        // -190,211484871458	61,8028399266188
        // -117,556099517152	-161,804089770047
        // 117,558476862896	-161,802362521924
        // 190,210576792898	61,8056346631355

        let coords = [
            {x: 0, y: 200},
            {x: -190, y: 61},
            {x: -117, y: -161},
            {x: 117, y: -161},
            {x: 190, y: 60},
        ];
        let index = 0;
        coords.forEach(function (coord) {
            magnits[index] = new Magnit(coord.x + m_width, coord.y + m_height, 200);
            index++;
        });
        
        for (let i = 0; i < 10000; i++) {
            let x = Math.floor(Math.random() * canvasNode.width);
            let y = Math.floor(Math.random() * canvasNode.height);
            let z = Math.floor(Math.random() * canvasNode.height);
            let angle = (Math.random() * 360);
            //let angle = 180;

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
            
            //let angle = randomMinMax(0, 359, 1);
            //value.angle = changeAngle(value.angle);
            if (value.x < 0 || value.x > width || value.y < 0 || value.y > height) {
                value.x = Math.floor(Math.random() * canvasNode.width);
                value.y = Math.floor(Math.random() * canvasNode.height);
                value.angle = (Math.random() * 360);
            }
            
            let rad = getRadians(value.angle);
            
            let dopX = Math.max(noise.perlin3(value.x / 100, value.y / 100, value.z/100));
            let dopY = Math.max(noise.perlin3(value.x / 100, value.y / 100, -value.z/100));            
            let newX = 3 * Math.cos(rad) + dopX;
            newX = value.x + newX;
            let newY = 3 * Math.sin(rad) + dopY;
            newY = value.y + newY;
        
            drawLine(ctx, value.x, value.y, newX, newY);

            value.x = newX;
            value.y = newY;

            
            magnits.forEach(function (magnit) {
                calcMagnetic(value, magnit);
            })
            
            

            /*if ((Math.random() * 100) > 99) {
                noise.seed(Math.round(Math.random() * 65000));
            }*/
            //blur()
            //console.log(value.x, value.y, newX, newY);
        });
        ctx.globalCompositeOperation = 'source-over';
        ctx.fillStyle = 'rgba(0, 0, 0, .085)';
        ctx.fillRect(0, 0, width, height);
        ctx.strokeStyle = 'hsla(' + hue + ', 75%, 50%, .55)';
        ctx.globalCompositeOperation = 'lighter';
        
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
    function getAngle(rad) {
        return rad * (180/PI);
    }
    function getLength(xA, yA, xB, yB) {
        return Math.abs(
            Math.sqrt(
                Math.pow(xB-xA, 2) + Math.pow(yB-yA, 2)
            )
        );
    }
    function drawLine(ctx, sX, sY, eX, eY) {
        ctx.moveTo(sX, sY);
        ctx.lineTo(eX, eY);
    }

    function calcMagnetic(value, magnit_point) {
        let length_to_magnit = getLength(value.x, value.y, magnit_point.x, magnit_point.y);

        if (length_to_magnit < magnit_point.power) {

            let rad2 = Math.atan2( Math.abs(magnit_point.y - value.y), Math.abs(magnit_point.x - value.x));
            let angle2 = getAngle(rad2);

            if (angle2 < 0) {
                angle2 = 360 + angle2;
            }
            
            let rad = getRadians(value.angle);
            let radd = Math.abs(rad - rad2)/1000;
            radd = rad > rad2 ? rad + radd : rad - radd;
            let avgAngle =  getAngle(radd);
            
            
            value.angle = avgAngle;
        }
    }

    init();
    function changeAngle(angle) {
        let delta = Math.random() * 10;
        if ((Math.random() * 100) > 50) {
            angle -= delta;
        } else {
            angle += delta;
        }
        if (angle < 0) {
            angle = 359;
        }
        if (angle > 359) {
            angle = 0;
        }
        return angle;
    }
})(document, window);
