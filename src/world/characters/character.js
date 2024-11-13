/**
 * @typedef CharacterConfig
 * @type {object}
 * @property {Phaser.Scene} scene
 * @property {string} assetKey
 * @property {number} [assetFrame=0]
 * @property {import("../../types/typedef").Coordinate} position
 */

export class Character {
    /** @type {Phaser.Scene} */
    _scene
    /** @type {Phaser.GameObjects.Sprite} */
    _phaserGameObject

    /**
     * @param {CharacterConfig} config 
     */
    constructor(config) {
        this._scene = config.scene
        this._phaserGameObject = this._scene.add.sprite(config.position.x, config.position.y, config.assetKey, config.assetFrame || 0).setOrigin(0)
    }
}