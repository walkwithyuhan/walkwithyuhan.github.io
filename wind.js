'use strict';
(() => {
 const canvas = document.querySelector('.wind-canvas');
 const scene = document.querySelector('.scene');
 if (!canvas || !scene) return;
 const gl = canvas.getContext('webgl', {alpha:false,antialias:false,powerPreference:'low-power'});
 if (!gl) return; // The original painting remains visible as the fallback.
 function shader(type, source) {
  const item = gl.createShader(type); gl.shaderSource(item, source); gl.compileShader(item);
  if (!gl.getShaderParameter(item,gl.COMPILE_STATUS)) { gl.deleteShader(item); throw new Error('Unable to prepare foliage'); }
  return item;
 }
 let program;
 try {
  program = gl.createProgram();
  gl.attachShader(program,shader(gl.VERTEX_SHADER, 'attribute vec2 a_position; varying vec2 v_uv; void main(){v_uv=(a_position+1.0)*0.5;gl_Position=vec4(a_position,0.0,1.0);}'));
  gl.attachShader(program,shader(gl.FRAGMENT_SHADER, `precision mediump float;
   varying vec2 v_uv;
   uniform sampler2D u_painting; uniform sampler2D u_story;
   uniform float u_time; uniform float u_mix; uniform float u_strength;
   float leafMask(vec3 color){
    // The artwork's orange/brown branches and cream sky stay fixed.
    float green=smoothstep(0.015,0.10,color.g-color.r);
    float foliage=smoothstep(0.04,0.15,color.g-color.b);
    float saturation=max(max(color.r,color.g),color.b)-min(min(color.r,color.g),color.b);
    return green*foliage*smoothstep(0.08,0.22,saturation);
   }
   vec4 paintingAt(vec2 uv){return mix(texture2D(u_painting,uv),texture2D(u_story,uv),u_mix);}
   void main(){
    vec2 uv=v_uv;
    vec4 original=paintingAt(uv);
    float sides=max(1.0-smoothstep(0.12,0.33,uv.x),smoothstep(0.67,0.90,uv.x));
    float canopy=smoothstep(0.16,0.42,uv.y);
    float wind=sides*canopy*u_strength*leafMask(original.rgb);
    float gust=sin(u_time*0.66+uv.y*8.0)*0.0008;
    float flutter=sin(u_time*1.25+uv.y*29.0+uv.x*17.0)*0.0005;
    uv.x+=(gust+flutter)*wind;
    uv.y+=sin(u_time*0.83+uv.x*20.0+uv.y*13.0)*0.0008*wind;
    uv=clamp(uv,0.001,0.999);
    vec4 displaced=paintingAt(uv);
    // Never pull a branch into a leaf pixel as the foliage shifts.
    gl_FragColor=mix(original,displaced,leafMask(displaced.rgb));
   }`));
  gl.linkProgram(program);
  if (!gl.getProgramParameter(program,gl.LINK_STATUS)) return;
 } catch { return; }
 gl.useProgram(program);
 const buffer=gl.createBuffer();gl.bindBuffer(gl.ARRAY_BUFFER,buffer);
 gl.bufferData(gl.ARRAY_BUFFER,new Float32Array([-1,-1,1,-1,-1,1,-1,1,1,-1,1,1]),gl.STATIC_DRAW);
 const position=gl.getAttribLocation(program,'a_position');
 gl.enableVertexAttribArray(position);gl.vertexAttribPointer(position,2,gl.FLOAT,false,0,0);
 const timeUniform=gl.getUniformLocation(program,'u_time');
 const mixUniform=gl.getUniformLocation(program,'u_mix');
 const strengthUniform=gl.getUniformLocation(program,'u_strength');
 gl.uniform1i(gl.getUniformLocation(program,'u_painting'),0);
 gl.uniform1i(gl.getUniformLocation(program,'u_story'),1);
 const reduced=window.matchMedia('(prefers-reduced-motion: reduce)');
 function loadTexture(url, unit){
  return new Promise((resolve,reject)=>{
   const img=new Image();
   img.onload=()=>{
    gl.activeTexture(gl.TEXTURE0+unit);
    const texture=gl.createTexture();gl.bindTexture(gl.TEXTURE_2D,texture);
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL,true);
    gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_S,gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_T,gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MIN_FILTER,gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MAG_FILTER,gl.LINEAR);
    gl.texImage2D(gl.TEXTURE_2D,0,gl.RGBA,gl.RGBA,gl.UNSIGNED_BYTE,img);
    resolve();
   };
   img.onerror=reject; img.src=url;
  });
 }
 let visible=true;
 new IntersectionObserver(([entry])=>{visible=entry.isIntersecting;},{threshold:0}).observe(scene);
 let last=0, time=0, drawTime=0;
 function draw(timestamp){
  const delta=last ? Math.min((timestamp-last)/1000,0.08) : 0;
  last=timestamp;
  if (visible && !document.hidden && timestamp-drawTime>=32){
   const elapsed=drawTime ? Math.min((timestamp-drawTime)/1000,0.1) : 0;
   drawTime=timestamp;
   const paused=document.body.classList.contains('motion-paused');
   if(!paused&&!reduced.matches) time+=elapsed;
   const width=Math.min(2000,Math.max(640,Math.round(canvas.clientWidth)));
   const height=Math.round(width*939/1675);
   if(canvas.width!==width||canvas.height!==height){canvas.width=width;canvas.height=height;gl.viewport(0,0,width,height);}
   gl.uniform1f(timeUniform,time);
   gl.uniform1f(mixUniform,Number.parseFloat(scene.style.getPropertyValue('--story-art-opacity'))||0);
   gl.uniform1f(strengthUniform,reduced.matches?0:1);
   gl.drawArrays(gl.TRIANGLES,0,6);
  }
  requestAnimationFrame(draw);
 }
 canvas.addEventListener('webglcontextlost',event=>{event.preventDefault();canvas.classList.remove('is-ready');});
 canvas.addEventListener('webglcontextrestored',()=>location.reload());
 Promise.all([loadTexture('assets/afternoon.png',0),loadTexture('assets/afternoon-story.png',1)]).then(()=>{
  canvas.classList.add('is-ready');requestAnimationFrame(draw);
 }).catch(()=>{});
})();
