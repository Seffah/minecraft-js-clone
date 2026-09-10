import * as THREE from 'three'
import { blocks } from './blocks'

const collisionMaterial = new THREE.MeshBasicMaterial({
    color: 0xff0000,
    transparent: true,
    opacity: 0.2
})

const collisionGeometry = new THREE.BoxGeometry(1.001, 1.001, 1.001)

const contactMaterial = new THREE.MeshBasicMaterial({
    wireframe: true,
    color: 0x00ff00
})
const contactGeometry = new THREE.SphereGeometry(0.05, 6, 6)


export class Physics {

    gravity = 32

    // Physics simulation rate
    simulationRate = 250
    stepSize = 1 / this.simulationRate
    accumulator = 0

    constructor(scene) {
        this.helpers = new THREE.Group()
        scene.add(this.helpers)
    }

    /**
     * Moves the physics simulation forward in time by 'dt'
     * @param {number} dt 
     * @param {Player} player
     * @param {World} world
     */
    update(dt, player, world) {
        this.helpers.clear()

        this.accumulator += dt

        while (this.accumulator >= this.stepSize) {
            player.velocity.y -= this.gravity * this.stepSize
            player.update(this.stepSize)

            this.detectCollisions(player, world)

            this.accumulator -= this.stepSize
        }

        player.updateBoundsHelper()

    }

    /**
     * Main function for collision detection
     */
    detectCollisions(player, world) {
        player.onGround = false
        const candidates = this.broadPhase(player, world)
        const collisions = this.narrowPhase(candidates, player)

        if (collisions.length > 0) {
            this.resolveCollisions(collisions, player)
        }

    }


    /**
     * Performs a rough search against the world to return all
     * possible blocks the player may be colliding with
     * @returns {{ id: number, instanceId: number }[]}
     */
    broadPhase(player, world) {

        const candidates = []

        // Get the extents of the player
        const extents = {
            x: {
                min: Math.floor(player.position.x - player.radius),
                max: Math.ceil(player.position.x + player.radius)
            },
            y: {
                min: Math.floor(player.position.y - player.height),
                max: Math.ceil(player.position.y)
            },
            z: {
                min: Math.floor(player.position.z - player.radius),
                max: Math.ceil(player.position.z + player.radius)
            }
        }

        // Loop through all blocks within player extents for possible collision candidates
        for (let x = extents.x.min; x <= extents.x.max; x++) {
            for (let y = extents.y.min; y <= extents.y.max; y++) {
                for (let z = extents.z.min; z <= extents.z.max; z++) {

                    const block = world.getBlock(x, y, z)
                    if (block && block.id !== blocks.empty.id) {
                        const blockPos = { x, y, z }
                        candidates.push(blockPos)
                        this.addCollisionHelper(blockPos)
                    }
                }

            }

        }
        console.log(`Broad phase candidates ${candidates.length}`)
        return candidates
    }


    /**
     * Narrows down the blocks found in the broad-phase to the set
     * of blocks the player is actually colliding with
     * @param {{ id: number, instanceId: number }[]} candidates 
     * @returns 
     */

    narrowPhase(candidates, player) {
        const collisions = []

        for (const block of candidates) {
            const p = player.position
            const closestPoint = {
                x: Math.max(block.x - 0.5, Math.min(player.position.x, block.x + 0.5)),
                y: Math.max(block.y - 0.5, Math.min(player.position.y - (player.height / 2), block.y + 0.5)),
                z: Math.max(block.z - 0.5, Math.min(player.position.z, block.z + 0.5)),
            }

            const dx = closestPoint.x - player.position.x
            const dy = closestPoint.y - (player.position.y - player.height / 2)
            const dz = closestPoint.z - player.position.z

            if (this.pointInPlayerBoundingCylinder(closestPoint, player)) {

                const overlapY = (player.height / 2) - Math.abs(dy)
                const overlapXZ = player.radius - Math.sqrt(dx * dx + dz * dz)

                let normal, overlap
                if (overlapY < overlapXZ) {
                    normal = new THREE.Vector3(0, -Math.sign(dy), 0)
                    overlap = overlapY
                    player.onGround = true
                } else {
                    normal = new THREE.Vector3(-dx, 0, -dz).normalize()
                    overlap = overlapXZ
                }

                collisions.push({
                    block,
                    contactPoint: closestPoint,
                    normal,
                    overlap
                })

                this.addContactPointHelper(closestPoint)
            }

        }
        console.log(`Narrowphase collisions ${collisions.length}`)
        return collisions
    }


    /**
     * Resolves each of the collisions found in the narrow-phase
     * @param {*} collisions 
     * @param {Player} player
     */
    resolveCollisions(collisions, player) {
        collisions.sort((a, b) => {
            return a.overlap < b.overlap
        })

        for (const collision of collisions) {
            if (!this.pointInPlayerBoundingCylinder(collision.contactPoint, player)) continue
            let deltaPosition = collision.normal.clone()
            deltaPosition.multiplyScalar(collision.overlap)
            player.position.add(deltaPosition)

            let magnitude = player.worldVelocity.dot(collision.normal)
            let velocityAdjustment = collision.normal.clone().multiplyScalar(magnitude)

            player.applyWorldDeltaVelocity(velocityAdjustment.negate())

        }
    }

    /**
     * Visualizes the block the player is colliding with
     * @param {THREE.Object3D} block 
     */
    addCollisionHelper(block) {
        const blockMesh = new THREE.Mesh(collisionGeometry, collisionMaterial)
        blockMesh.position.copy(block)
        this.helpers.add(blockMesh)
    }

    /**
     * Visualizes the contact at the point 'p'
     * @param {{ x, y, z }} p 
     */
    addContactPointHelper(p) {
        const contactMesh = new THREE.Mesh(contactGeometry, contactMaterial)
        contactMesh.position.copy(p)
        this.helpers.add(contactMesh)
    }


    /**
     * Returns true if the point 'p' is inside the player's bounding cylinder
     * @param {{ x: number, y: number, z: number }} p 
     * @param {Player} player 
     * @returns {boolean}
     */
    pointInPlayerBoundingCylinder(p, player) {
        const dx = p.x - player.position.x
        const dy = p.y - (player.position.y - player.height / 2)
        const dz = p.z - player.position.z

        const r_sq = dx * dx + dz * dz

        return (Math.abs(dy) < player.height / 2) && (r_sq < player.radius * player.radius)

    }
}