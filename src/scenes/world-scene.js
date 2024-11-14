import Phaser from '../lib/phaser.js'
import { WORLD_ASSET_KEYS } from '../assets/asset-keys.js'
import { SCENE_KEYS } from "./scene-keys.js"
import { Player } from '../world/characters/player.js'
import { Controls } from '../utils/controls.js'
import { DIRECTION } from '../common/direction.js'
import { TILED_COLLISION_LAYER_ALPHA, TILE_SIZE } from '../config.js'

/** @type {import('../types/typedef.js').Coordinate} */
const PLAYER_POSITION = Object.freeze({
    x: 6 * TILE_SIZE,
    y: 21 * TILE_SIZE,
})

export class WorldScene extends Phaser.Scene {
    /** @type {Player} */
    #player
    /** @type {Controls} */
    #controls
    /** @type {Phaser.Tilemaps.TilemapLayer} */
    #encounterLayer
    /** @type {boolean} */
    #wildMonsterEncountered

    constructor() {
        super({
          key: SCENE_KEYS.WORLD_SCENE,
        })
    }

    init() {
        this.#wildMonsterEncountered = false
    }

    create() {
        console.log(`[${WorldScene.name}:preload] invoked`)

        const x = 6 * TILE_SIZE
        const y = 22 * TILE_SIZE

        // this value comes from the width of the level background image we are using
        // we set the max camera width to the size of our image in order to control what
        // is visible to the player, since the phaser game world is infinite.
        this.cameras.main.setBounds(0, 0, 1280, 2176)
        this.cameras.main.setZoom(0.8)
        this.cameras.main.centerOn(x, y)

        // create map and collision layer
        const map = this.make.tilemap({ key: WORLD_ASSET_KEYS.WORLD_MAIN_LEVEL })
        // The first parameter is the name of the tileset in Tiled and the second parameter is the key
        // of the tileset image used when loading the file in preload.
        const collisionTiles = map.addTilesetImage('collision', WORLD_ASSET_KEYS.WORLD_COLLISION)
        if (!collisionTiles) {
            console.log(`[${WorldScene.name}:create] encountered error while creating collision tileset using data from tiled`)
            return
        }
        const collisionLayer = map.createLayer('Collision', collisionTiles, 0, 0)
        if (!collisionLayer) {
            console.log(`[${WorldScene.name}:create] encountered error while creating collision layer using data from tiled`)
            return
        }
        collisionLayer.setAlpha(TILED_COLLISION_LAYER_ALPHA).setDepth(2)

        const encounterTiles = map.addTilesetImage('encounter', WORLD_ASSET_KEYS.WORLD_ENCOUNTER_ZONE)
        if (!encounterTiles) {
            console.log(`[${WorldScene.name}:create] encountered error while creating encounter tileset using data from tiled`)
            return
        }
        this.#encounterLayer = map.createLayer('Encounter', encounterTiles, 0, 0)
        if (!this.#encounterLayer) {
            console.log(`[${WorldScene.name}:create] encountered error while creating encounter layer using data from tiled`)
            return
        }
        this.#encounterLayer.setAlpha(TILED_COLLISION_LAYER_ALPHA).setDepth(2)

        this.add.image(0, 0, WORLD_ASSET_KEYS.WORLD_BACKGROUND, 0).setOrigin(0)

        this.#player = new Player({
            scene: this,
            position: PLAYER_POSITION,
            direction: DIRECTION.DOWN,
            collisionLayer: collisionLayer,
            spriteGridMovementFinishedCallback: () => {
                this.#handlePlayerMovementUpdate()
            }
        })
        this.cameras.main.startFollow(this.#player.sprite)

        this.add.image(0, 0, WORLD_ASSET_KEYS.WORLD_FOREGROUND, 0).setOrigin(0)

        this.#controls = new Controls(this)

        this.cameras.main.fadeIn(1000, 0, 0, 0)
    }

    update(time) {
        if (this.#wildMonsterEncountered) {
            this.#player.update(time)
            return
        }
        
        const selectedDirection = this.#controls.getDirectionKeyPressedDown()
        if (selectedDirection !== DIRECTION.NONE) {
            this.#player.moveCharacter(selectedDirection)
        }

        this.#player.update(time)
    }

    #handlePlayerMovementUpdate() {
        if (!this.#encounterLayer) {
            return
        }

        const isInEncounterZone = this.#encounterLayer.getTileAtWorldXY(this.#player.sprite.x, this.#player.sprite.y, true).index !== -1
        if (!isInEncounterZone) {
            return
        }

        console.log(`[${WorldScene.name}:handlePlayerMovementUpdate] player is in an encounter zone`)
        this.#wildMonsterEncountered = Math.random() < 0.9
        if (this.#wildMonsterEncountered) {
            console.log(`[${WorldScene.name}:handlePlayerMovementUpdate] player encountered a wild monster`)
            this.cameras.main.fadeOut(2000)
            this.cameras.main.once(Phaser.Cameras.Scene2D.Events.FADE_OUT_COMPLETE, () => {
                this.scene.start(SCENE_KEYS.BATTLE_SCENE)
            })
        }
    }
}