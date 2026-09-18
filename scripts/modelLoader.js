import { GLTFLoader } from "three/examples/jsm/Addons.js";

export class ModelLoader {
    loader = new GLTFLoader()

    models = {
        pickaxe: undefined
    }

    loadModels(onLoad) {
        this.loader.load('/models/pickaxe.glb', (model) => {
            const mesh = model.scene
            this.models.pickaxe = mesh
            onLoad(this.models)
        })
    }
}