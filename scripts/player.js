import * as THREE from 'three'
import { PointerLockControls } from 'three/examples/jsm/Addons.js'


export class Player {

    camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.1, 100)
    controls = new PointerLockControls(this.camera, document.body)
    cameraHelper = new THREE.CameraHelper(this.camera)

    maxSpeed = 10
    velocity = new THREE.Vector3()
    input = new THREE.Vector3()


    constructor(scene) {
        this.position.set(32, 16, 32)
        scene.add(this.camera)
        scene.add(this.cameraHelper)
        
        document.addEventListener('keydown', (e) => this.onKeyDown(e))
        document.addEventListener('keyup', (e) => this.onKeyUp(e))
    }

    update(dt) {
        if (this.controls.isLocked) {
            this.velocity.x = this.input.x
            this.velocity.z = this.input.z
            this.controls.moveRight(this.velocity.x * dt)
            this.controls.moveForward(this.velocity.z * dt)
        }

        document.getElementById('player_position').innerHTML = this.toString()
    }

    onKeyDown(event) {
        if (!this.controls.isLocked) {
            this.controls.lock()
        }

        switch (event.code) {
            case 'KeyW':
                this.input.z = this.maxSpeed
                break;

            case 'KeyA':
                this.input.x = -this.maxSpeed
                break;
            
            case 'KeyS':
                this.input.z = -this.maxSpeed
                break;
            
            case 'KeyD':
                this.input.x = this.maxSpeed
                break;

            case 'KeyR':
                this.position.set(32, 16, 32)
                this.velocity.set(0, 0, 0)
                break
        
            default:
                break;
        }
        
    }

    onKeyUp(event) {
        switch (event.code) {
            case 'KeyW':
                this.input.z = 0
                break;

            case 'KeyA':
                this.input.x = 0
                break;
            
            case 'KeyS':
                this.input.z = 0
                break;
            
            case 'KeyD':
                this.input.x = 0
                break;

            default:
                break;
        }
    }

    get position() {
        return this.camera.position
    }

    toString() {
        let str = ''
        str += `X: ${this.position.x.toFixed(3)} `
        str += `Y: ${this.position.y.toFixed(3)} `
        str += `Z: ${this.position.z.toFixed(3)} `
        return str
    }
}