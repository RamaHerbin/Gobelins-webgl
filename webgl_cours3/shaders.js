/** @type {WebGLRenderingContext} */

const vert = /*glsl*/ `
  attribute vec2 aPosition;
  attribute vec2 aTexCoord;

  varying vec2 vTexCoord;

  void main() {
    gl_Position = vec4(aPosition, 1., 1.);

    gl_PointSize = 10.;

    vTexCoord = aTexCoord;
  }
`;

const frag = /*glsl*/ `
  precision highp float;

  uniform sampler2D tTex;
  uniform float uTime;

  varying vec2 vTexCoord;

  mat2 rotate2d(float _angle) {
    return mat2(cos(_angle), -sin(_angle),
                sin(_angle), cos(_angle));
  }

  void main() {
    
    float ratio = 256./512.;
    float test = distance(uTime, 1.);

    vec2 coord = vTexCoord;
    
    coord -= vec2(.5);
    coord *= rotate2d(uTime);
    coord += vec2(.5);

    coord.x += cos(uTime * 5. + coord.y);
    gl_FragColor = vec4(color, 1.);


    // vec3 texColor = texture2D(tTex, vTexCoord).rgb;

    // vec2 center = vec2(.5);

    // float mask = distance(vTexCoord, center);

    // mask = 1. - step(.3, mask);

    // vec3 color = texColor * mask;

    // gl_FragColor = vec4(color, 1.);

  }`;

export { vert, frag };
