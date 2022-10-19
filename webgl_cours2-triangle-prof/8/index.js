import { vert, frag } from "./shaders.js"
import { createProgram, createShader } from "./utils.js"

let size = 512

let cvs = null 
let gl = null 

let vShader = null
let fShader = null
let program = null

// attribute
let positionAttribLocation = null
let colorAttribLocation = null 
// buffers
let buffer = null

const NB_GEOM = 10

const setupCanvas = () => {

  // create canvas
  cvs = document.createElement('canvas')
  cvs.style.width = `${size}px`
  cvs.style.height = `${size}px`
  cvs.width = size
  cvs.height = size
  
  // get context
  gl = cvs.getContext('webgl')

  document.body.appendChild(cvs)

}

const setupProgram = () => {
  vShader = createShader(gl, gl.VERTEX_SHADER, vert)
  fShader = createShader(gl, gl.FRAGMENT_SHADER, frag)
  program = createProgram(gl, vShader, fShader)

}

const getTriangleData = () => {

  const data = []
  for (let i = 0; i < 3; i++) {
    const color = [ Math.random(), Math.random(), Math.random() ]
    data.push(
      -1 + Math.random() * 2, -1 + Math.random() * 2, color[0], color[1], color[2],
      -1 + Math.random() * 2, -1 + Math.random() * 2, color[0], color[1], color[2],
      -1 + Math.random() * 2, -1 + Math.random() * 2, color[0], color[1], color[2],
    )
  }
  
  return data
}

const getRectData = () => {

  /*
  -1,1 .____. 1,1
       |   /|
       |  / | 
       | /  | 
  -1,1 ./___. 1,-1
  */
  const color = [ Math.random(), Math.random(), Math.random() ]
  const scl = Math.random()
  const data = [
    // first
    -scl, -scl, color[0], color[1], color[2],
    -scl,  scl, color[0], color[1], color[2],
     scl,  scl, color[0], color[1], color[2],

     // second
    -scl, -scl, color[0], color[1], color[2],
     scl,  scl, color[0], color[1], color[2],
     scl, -scl, color[0], color[1], color[2],
  ]
  return data
}
 
const setupData = () => {
  // attrib memory location
  positionAttribLocation = gl.getAttribLocation(program, 'aPosition')
  colorAttribLocation = gl.getAttribLocation(program, 'aColor')

  // buffer (geometry)
  buffer = gl.createBuffer()
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer)

  // data
  let data = []
  for (let i = 0; i < NB_GEOM; i++) {
    const geomData = getRectData()
    data = data.concat(geomData)
  }
  const bufferData = new Float32Array(data)

  gl.bufferData(gl.ARRAY_BUFFER, bufferData, gl.STATIC_DRAW)

  gl.bindBuffer(gl.ARRAY_BUFFER, null)
}

const render = () => {

  gl.viewport(0, 0, size, size)

  // clear before drawing
  gl.clearColor(0, 0, 0, 1)
  gl.clear(gl.COLOR_BUFFER_BIT)

  // bind the shader to use
  gl.useProgram(program)

  // bind buffer
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer)

  // bind data for that buffer
  gl.enableVertexAttribArray(positionAttribLocation)
  gl.enableVertexAttribArray(colorAttribLocation)

  // tell the buffer how to use the data
  gl.vertexAttribPointer(positionAttribLocation, 2, gl.FLOAT, false, 20, 0)
  gl.vertexAttribPointer(colorAttribLocation, 3, gl.FLOAT, false, 20, 8)

  gl.drawArrays(gl.TRIANGLES, 0, 6 * NB_GEOM)

}

// const onFrame = () => {

//   requestAnimationFrame(onFrame)

//   update()
//   render()

// }

setupCanvas()
setupProgram()
setupData()
render()