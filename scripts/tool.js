import * as THREE from "three";

export class Tool extends THREE.Group {
    // Whether or not the tool is currently animating
    animate = false

    // Start time for animation
    animationStart = 0;

    // Speed of tool animation in rad/s
    animationSpeed = 0.025

    // Duration of animation
    animationDuration = 750

    // Amplitude of animation
    animationAmplitude = 0.5

    // Currently active animation
    animation = undefined

    // 3D mesh for the actual tool
    toolMesh = undefined



    /*
    * Trigger a new animation of the tool
    */
    startAnimation() {
        if (this.animate) return
        
        this.animate = true
        this.animationStart = performance.now()

        // Stop existing animation
        clearTimeout(this.animation)

        this.animation = setTimeout(() => {
            this.animate = false
            this.toolMesh.rotation.y = 0
        }, this.animationDuration)
    }

    get animationTime() {
        return performance.now() - this.animationStart
    }

    /*
    * Updates the animation state of the tool  
    */
   update() {
    if (this.animate && this.toolMesh) {
        // Oscillate the tool back and forth
        this.toolMesh.rotation.y = this.animationAmplitude * Math.sin(this.animationTime * this.animationSpeed)
    }
   }

    setMesh(mesh) {
        this.clear()

        this.toolMesh = mesh
        this.add(mesh)
        mesh.receiveShadow = true
        mesh.castShadow = true

        // Make tool be like it's holding the player
        this.position.set(0.6, -0.3, -0.5)
        this.scale.set(0.5, 0.5, 0.5)
        this.rotation.z = Math.PI / 2
        this.rotation.y = Math.PI + 0.2
    }

}