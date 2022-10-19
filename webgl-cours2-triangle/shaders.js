



// Point après le nombre pour préciser le float sinon interprété comme int. (GPU TEUBÉ)
// export const vert = /*GLSL*/`
//     attribute vec2 aPosition;
//     attribute vec3 aColor;

//     uniform float uTime;

//     varying vec3 vColor;

//     void main() {
//         vec2 pos = vec2(aPosition.x + uTime, aPosition.y);

//         pos.y = mod(pos.y, 1.);
//         pos.y -= .5;
//         pos.y *= 2.;

//         gl_Position = vec4(pos, 1., 1.);

//         gl_PointSize = 40.;

//         vColor = aColor;
//     }
// `
/** @type {WebGLRenderingContext} */
export const vert = /*GLSL*/`

attribute vec2 aPosition;
attribute vec3 aColor;

uniform float uTime;

varying vec3 vColor;

void main() {
  float t = uTime * aPosition.y;
  vec2 pos = vec2(aPosition.x + t, aPosition.y);
  // vec2 pos = vec2(aPosition.x + t, aPosition.y + uTime);
  // vec2 pos = vec2(aPosition.x * t, aPosition.y + uTime);

  pos.x = mod( pos.x, 2. ) - 1.;
  pos.y = mod( pos.y, 2. ) - 1.;

  gl_Position = vec4(pos, 1., 1.);

  gl_PointSize = 6.;

  vColor = aColor;
}`;

export const frag = /* GLSL */`
    precision highp float;

    varying vec3 vColor;


    void main() {
        vec3 color = vColor;
        gl_FragColor = vec4(color, 1.);
    }
`;




