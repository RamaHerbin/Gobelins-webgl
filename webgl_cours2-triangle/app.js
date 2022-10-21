import { frag, vert } from './shaders.js';

const size = 512;
const dpr = window.devicePixelRatio;

let $canvas;
let gl;

let vShader = null;
let rShader = null;
let program = null;

const NB_POINTS = 1000;

let positionAttriPos;
let colorAttribPos;
let bufferData = null;
let buffer;

let time = 0
let timeUniformLoc = null

const getTriangleData = () => {
  const data = [];

  for (let index = 0; indexindex < 3; indexindex++) {
    const color = [Math.random(), Math.random(), Math.random()]
    data.push(
      -1 + Math.random() * 2, -1 + Math.random() * 2, color[0], color[1], color[2],
      -1 + Math.random() * 2, -1 + Math.random() * 2, color[0], color[1], color[2],
      -1 + Math.random() * 2, -1 + Math.random() * 2, color[0], color[1], color[2],
    )
  }
}

const setupCanvas = () => {

  $canvas = document.querySelector("#webgl");

  $canvas.style.width = `${size}px`;
  $canvas.style.height = `${size}px`;
  $canvas.style.background = 'black';
  $canvas.width = size * dpr
  $canvas.height = size * dpr;

  gl = $canvas.getContext('webgl')
}

// gl = ccontext
// type VERTEX_SHADER || FRAGMENT SHADER
// src shader string
const createShader = (gl, type, src) => {
  const shader = gl.createShader(type)
  gl.shaderSource(shader, src)
  gl.compileShader(shader);

  const didCompile = gl.getShaderParameter(shader, gl.COMPILE_STATUS)

  if (didCompile) {
    return shader;
  } else {
    console.warn(gl.getShaderInfoLog(shader))
  }

}

const createProgram = (gl, vertexShader, fragmentShader) => {
  const prg = gl.createProgram();
  gl.attachShader(prg, vertexShader);
  gl.attachShader(prg, fragmentShader);
  gl.linkProgram(prg);

  const didLink = gl.getProgramParameter(prg, gl.LINK_STATUS);

  if (didLink) {
    return prg;
  } else {
    console.warn(gl.getProgramInfoLog(prg));
  }

  return prg;
}

const setupProgram = () => {

  vShader = createShader(gl, gl.VERTEX_SHADER, vert);
  rShader = createShader(gl, gl.FRAGMENT_SHADER, frag);
  program = createProgram(gl, vShader, rShader);
}

const setupData = () => {
  // attrib memory location
  positionAttriPos = gl.getAttribLocation(program, 'aPosition')
  colorAttribPos = gl.getAttribLocation(program, 'aColor');

  // uniform memory location
  timeUniformLoc = gl.getUniformLocation(program, 'uTime');
  // buffer
  buffer = gl.createBuffer()
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);

  const data = [];


  // data
  const positions = []
  const palettes = ['#ff0099', '#fff100', '#000ff5']
  for (let i = 0; i < NB_POINTS; i++) {
    const x = -1 + Math.random() * 2
    const y = -1 + Math.random() * 2

    const idx = Math.floor(Math.random() * (palettes.length))
    const color = palettes[idx]
    let { r, g, b } = hexToRgb(color)

    // Le gpu attend des valeurs entre 0 et 1
    r /= 255
    g /= 255
    b /= 255

    positions.push(x, y, r, g, b)
  }

  // data
  bufferData = new Float32Array(positions);

  gl.bufferData(gl.ARRAY_BUFFER, bufferData, gl.STATIC_DRAW);
  gl.bindBuffer(gl.ARRAY_BUFFER, null);
}

const render = () => {
  console.log("render");
  gl.viewport(0, 0, size * dpr, size * dpr);

  // clear before drawing
  gl.clearColor(0, 0, 0, 1);
  gl.clear(gl.COLOR_BUFFER_BIT);

  // bind the shader to use
  gl.useProgram(program);
  gl.uniform1f(timeUniformLoc, time);

  // bind buffer
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);

  // bind data
  gl.enableVertexAttribArray(positionAttriPos);
  gl.enableVertexAttribArray(colorAttribPos);

  gl.vertexAttribPointer(positionAttriPos, 2, gl.FLOAT, false, 20, 0);
  gl.vertexAttribPointer(colorAttribPos, 3, gl.FLOAT, false, 20, 8);
  gl.drawArrays(gl.TRIANGLES, 0, NB_POINTS);
}


const onUpdate = () => {
  const nbComponent = 5;

  time += .01


  // for (let i = 0; i < NB_POINTS; i++) {

  //     let x = bufferData[i*nbComponent];
  //     let y = bufferData[i*nbComponent+1];

  //     x += 0.001;        
  //     bufferData[i*nbComponent] = x
  // }

  // gl.bindBuffer(gl.ARRAY_BUFFER, buffer)
  // gl.bufferSubData(gl.ARRAY_BUFFER, 0,bufferData)

}

const onFrame = () => {
  requestAnimationFrame(onFrame);
  onUpdate()
  render()
}




setupCanvas();
setupProgram();
setupData();
onFrame();
