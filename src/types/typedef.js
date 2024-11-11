import Phaser from "../lib/phaser.js"

/**
 * @typedef BattleMonsterConfig
 * @type {Object}
 * @property {Phaser.Scene} scene the Phaser 3 Scene the battle menu will be added to
 * @property {Monster} monsterDetails the details of the monster that is currently in battle
 * @property {number} [scaleHealthBarBackgroundImageByY=1] scales the health bar background vertically by the specivied value, default
 * @property {boolean} [skipBattleAnimations=false] used to skip all animations tied to the monster during battle
 */

/**
 * @typedef Monster
 * @type {Object}
 * @property {string} name
 * @property {string} assetKey
 * @property {number} [assetFrame=0]
 * @property {number} currentLevel
 * @property {number} maxHp
 * @property {number} currentHp
 * @property {number} baseAttack
 * @property {number[]} attackIds
 */

/**
 * @typedef Coordinate
 * @type {Object}
 * @property {number} x
 * @property {number} y
 */

/**
 * @typedef Attack
 * @type {Object}
 * @property {number} id
 * @property {string} name
 * @property {string} animationName
 */