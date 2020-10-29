import {sculptToThreeJSMesh} from 'shader-park-core/dist/shader-park-core.esm.js'
import {Vector3} from "three"
export class Sculpture {
  constructor(spCode) {
    this.mesh = sculptToThreeJSMesh(spCode);
    let uniformDescriptions = this.mesh.material.uniformDescriptions;
    this.matUniforms = this.mesh.material.uniforms;

    let defaultUniforms = { 'sculptureCenter': 0, 'opacity': 0, 'time': 0, 'stepSize': 0, 'mouse': 0};
    this.customUniforms = uniformDescriptions.filter(uniform => !(uniform.name in defaultUniforms));
    
    //set the default value of the uniforms
    this.customUniforms.forEach(uniform => this.matUniforms[uniform.name].value = uniform.value);

    // default uniforms for the scupture
    this.matUniforms['sculptureCenter'].value = new Vector3();
    this.matUniforms['mouse'].value = new Vector3();
    this.matUniforms['opacity'].value = 1.0;
    this.matUniforms['time'].value = 0.0;
    this.matUniforms['stepSize'].value = 0.85;
  }
  
  //TODO add in mouse and set the mouse
  update(params, callback) {
    if('time' in params) {
      this.matUniforms['time'].value = params.time;  
    }
    if('mouse' in params) {
      this.matUniforms['mouse'].value = params.mouse;  
    }
    
    if(callback && typeof callback === "function") {
      callback(this.customUniforms, this.matUniforms);  
    }
  }
  
  //expect position to be a Vector3, or pass in x, y, z.
  setPosition(position, y = undefined, z = undefined) {
    if(y && z) {
      //position is assumed to be an x value
      this.mesh.position.set(position, y, z);
      this.matUniforms['sculptureCenter'].value = new Vector3(position, y, z);
    } else {
      this.mesh.position.set(position.x, position.y, position.z);
      this.matUniforms['sculptureCenter'].value = position//new Vector3(position.x, position.y, position.z);
    }
  }
  
  setOpacity(opacity) {
    this.matUniforms['opacity'].value = opacity;
    this.mesh.visible = opacity !== 0.0;
  }
  
}