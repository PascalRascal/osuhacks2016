/**
*  init -	Called once when the component is initialized. Used to set up initial state and instantiate variables.
*  update -	Called both when the component is initialized and whenever the component’s data changes (e.g, via setAttribute). Used to modify the entity.
*  remove	- Called when the component detaches from the element (e.g., via removeAttribute). Used to undo all previous modifications to the entity.
*  tick	- Called on each render loop or tick of the scene. Used for continuous changes.
*  play	- Called whenever the scene or entity plays to add any background or dynamic behavior. Used to start or resume behavior.
*  pause -	Called whenever the scene or entity pauses to remove any background or dynamic behavior. Used to pause behavior.
*  updateSchema	- Called on every update. Can be used to dynamically modify the schema.
 */

var rotationData;
// Component to change to random color on click.
AFRAME.registerComponent('memekingprime', {
  init: function () {
      console.log("initated u fuck");
    var COLORS = ['red', 'green', 'blue'];
    this.el.addEventListener('click', function () {
      var randomIndex = Math.floor(Math.random() * COLORS.length);
      this.setAttribute('material', 'color', COLORS[randomIndex]);
      console.log('I was clicked!');
    });
  }
});

AFRAME.registerComponent('camerasensor', {
  rotationData: {},
  firstDown: false,
  timeOut: 1500,
  timeDown: 0,

  tick: function(time, timeDelta) {
    this.rotationData = this.el.getAttribute('rotation');
    if(this.rotationData.x < -55 && !this.firstDown){
      this.timeDown+= timeDelta;
    }else if(this.rotationData.x >= -55){
      this.timeDown = 0;
      this.firstDown = false;
    }
    if(this.timeDown > 2000 && !this.firstDown){
      this.firstDown = true;
      console.log("ur head is down and shit has been triggered!");

    }

  }
});

