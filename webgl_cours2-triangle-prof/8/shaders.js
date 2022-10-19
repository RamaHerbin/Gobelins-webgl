const vert = `
  attribute vec2 aPosition;
  attribute vec3 aColor;

  varying vec3 vColor;

  void main() {
    gl_Position = vec4(aPosition, 1., 1.);

    gl_PointSize = 10.;

    vColor = aColor;
  }
` 

const frag = `
  precision highp float;

  varying vec3 vColor;

  void main() {
    gl_FragColor = vec4(vColor, 1.);
  }
`

export {
  vert,
  frag
}