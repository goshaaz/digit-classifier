let MODEL_URL;
let model;
let prevTime = Date.now();
const zero = document.getElementById("zero")
const one = document.getElementById("one")
const two = document.getElementById("two")
const three = document.getElementById("three")
const four = document.getElementById("four")
const five = document.getElementById("five")
const six = document.getElementById("six")
const seven = document.getElementById("seven")
const eight = document.getElementById("eight")
const nine = document.getElementById("nine")
const valArr = [zero,one,two,three,four,five,six,seven,eight,nine]

const ul0 = document.getElementById("0")
const ul1 = document.getElementById("1")
const ul2 = document.getElementById("2")
const ul3 = document.getElementById("3")
const ul4 = document.getElementById("4")
const ul5 = document.getElementById("5")
const ul6 = document.getElementById("6")
const ul7 = document.getElementById("7")
const ul8 = document.getElementById("8")
const ul9 = document.getElementById("9")
const ulArr = [ul0, ul1, ul2, ul3, ul4, ul5, ul6, ul7, ul8, ul9]

setInterval(() => {
    let max_value = parseFloat(valArr[0].textContent)
        let max_index = 0
        for(let i = 1; i <= 9; i++){
            if(parseFloat(valArr[i].textContent) > max_value){
                max_value = parseFloat(valArr[i].textContent)
                max_index = i
            }
        }
        if(max_value == 0.00){
            for(let i = 0; i <= 9; i++){
                let ul = ulArr[i]
                ul.style.backgroundColor = ""
            }
        }else{
            for(let i = 0; i <= 9; i++){
                let ul = ulArr[i]
                if(max_index == i){
                    ul.style.backgroundColor = "lightgreen"
                }else{
                    ul.style.backgroundColor = ""
                }
            }
        }
}, 300)

window.addEventListener("load", () => {
    const canvas = document.querySelector("#canvas");
    const ctx = canvas.getContext("2d");

    canvas.height = 400
    canvas.width = 400


    let painting = false;

    function startPosition(e){
        painting = true;
        draw(e);
    }
    function finishedPosition(){
        painting = false;
        ctx.beginPath();
    }

    function draw(e){
        if(!painting) return;
        ctx.lineWidth = 30;
        ctx.lineCap = "round";
        var pos = getMousePos(canvas, e);
        ctx.lineTo(pos.x, pos.y);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(pos.x, pos.y);
        if(Date.now() - prevTime > 300){
            saveImage()
        }
    }

    canvas.addEventListener('mousedown', startPosition);
    canvas.addEventListener('mouseup', finishedPosition);
    canvas.addEventListener('mousemove', draw)
    canvas.addEventListener('mouseleave', () => {
        finishedPosition()
        painting = false
    })
})

function getMousePos(canvas, evt) {
    var rect = canvas.getBoundingClientRect();
    return {
      x: evt.clientX - rect.left,
      y: evt.clientY - rect.top
    };
}

async function saveImage(){
    const canvas = document.querySelector("#canvas");
    const ctx = canvas.getContext("2d");

    const smallcanvas = document.createElement('canvas');
    const smallctx = smallcanvas.getContext("2d")
    smallcanvas.width = 28
    smallcanvas.height = 28
    smallcanvas.style.border = '2px solid black'
    smallctx.globalCompositeOperation = 'luminosity'
    smallctx.drawImage(canvas, 0, 0, 28, 28)
    //document.body.appendChild(smallcanvas);


    const imageData = smallctx.getImageData(0, 0, smallcanvas.width, smallcanvas.height);
    const normalizedData = []
    for (let j = 0; j < imageData.data.length / 4; j++) {
        normalizedData.push((imageData.data[j*4+3])/255)
    }
    const batchImageArray = new Float32Array(normalizedData);
    const xs = tf.tensor2d(batchImageArray,[1, 784]);
    const xs_reshaped = xs.reshape([1, 28, 28, 1])
    const prediction_array = model.predict(xs_reshaped).array()
    prediction_array.then((res) => {
        zero.innerHTML = res[0][0].toFixed(2)
        one.innerHTML = res[0][1].toFixed(2)
        two.innerHTML = res[0][2].toFixed(2)
        three.innerHTML = res[0][3].toFixed(2)
        four.innerHTML = res[0][4].toFixed(2)
        five.innerHTML = res[0][5].toFixed(2)
        six.innerHTML = res[0][6].toFixed(2)
        seven.innerHTML = res[0][7].toFixed(2)
        eight.innerHTML = res[0][8].toFixed(2)
        nine.innerHTML = res[0][9].toFixed(2)
        prevTime = Date.now()
    })

}
const start = async () => {
    MODEL_URL = './predict_digits_cnn_tfjs/model.json';
    model = await tf.loadLayersModel(MODEL_URL);
}

function clearCanvas(){
    const canvas = document.querySelector("#canvas");
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0,0,canvas.width,canvas.height);
    zero.innerHTML = "0.00"
        one.innerHTML = "0.00"
        two.innerHTML = "0.00"
        three.innerHTML = "0.00"
        four.innerHTML = "0.00"
        five.innerHTML = "0.00"
        six.innerHTML = "0.00"
        seven.innerHTML = "0.00"
        eight.innerHTML = "0.00"
        nine.innerHTML = "0.00"
    for(let i = 0; i <= 8; i++){
        ulArr[i].style.backgroundColor = ""
        
    }    
}

start()
