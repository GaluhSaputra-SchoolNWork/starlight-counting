import Phaser from '../../../lib/phaser.js';
import { MONSTER_ASSET_KEYS, UI_ASSET_KEYS } from "../../../assets/asset-keys.js";
import { DIRECTION } from '../../../common/direction.js';
import { exhaustiveGuard } from '../../../utils/guard.js';

/**
 *  @typedef {keyof typeof BATTLE_MENU_OPTIONS} BattleMenuOptions
 */

/** @enum {BattleMenuOptions} */

const BATTLE_MENU_OPTIONS = Object.freeze({
    FIGHT: 'FIGHT',
    SWITCH: 'SWITCH',
    ITEM: 'ITEM',
    FLEE: 'FLEE',
});

const battleUiTextStyle = {
    color: 'black',
    fontSize: '30px',
};

const BATTLE_MENU_CURSOR_POS = Object.freeze({
    x: 42,
    y: 38,
});

export class BattleMenu {
    /** @type {Phaser.Scene} */
    #scene;
    /** @type {Phaser.GameObjects.Container} */
    #mainBattleMenuPhaserContainerGameObject;
    /** @type {Phaser.GameObjects.Container} */
    #moveSelectionSubBattleMenuPhaserContainerGameObject;
    /** @type {Phaser.GameObjects.Text} */
    #battleTextGameObjectLine1;
    /** @type {Phaser.GameObjects.Text} */
    #battleTextGameObjectLine2;
    /** @type {Phaser.GameObjects.Image} */
    #mainBattleMenuCursorPhaserImageGameObject;
    /** @type {Phaser.GameObjects.Image} */
    #attackBattleMenuCursorPhaserImageGameObject;
    /** @type {BattleMenuOptions} */
    #selectedBattleMenuOption;

    /**
     * 
     * @param {Phaser.Scene} scene the Phaser 3 Scene the battle menu willbe added to
     */
    constructor(scene) {
        this.#scene = scene;
        this.#selectedBattleMenuOption = BATTLE_MENU_OPTIONS.FIGHT;
        this.#createMainInfoPane();
        this.#createMainBattleMenu();
        this.#createMonsterAttackSubMenu();
    }

    showMainBattleMenu() {
        this.#battleTextGameObjectLine1.setText('what should');
        this.#mainBattleMenuPhaserContainerGameObject.setAlpha(1);
        this.#battleTextGameObjectLine1.setAlpha(1);
        this.#battleTextGameObjectLine2.setAlpha(1);

        this.#selectedBattleMenuOption = BATTLE_MENU_OPTIONS.FIGHT;
        this.#mainBattleMenuCursorPhaserImageGameObject.setPosition(BATTLE_MENU_CURSOR_POS.x, BATTLE_MENU_CURSOR_POS.y);
    }

    hideMainBattleMenu() {
        this.#mainBattleMenuPhaserContainerGameObject.setAlpha(0);
        this.#battleTextGameObjectLine1.setAlpha(0);
        this.#battleTextGameObjectLine2.setAlpha(0);
    }

    showMonsterAttackSubMenu() {
        this.#moveSelectionSubBattleMenuPhaserContainerGameObject.setAlpha(1);
    }

    hideMonsterAttackSubMenu() {
        this.#moveSelectionSubBattleMenuPhaserContainerGameObject.setAlpha(0);
    }

    /**
     * 
     * @param {import('../../../common/direction.js').Direction | 'OK' | 'CANCEL'} input 
     */
    handlePlayerInput(input) {
        console.log(input);
        if (input === 'CANCEL') {
            this.hideMonsterAttackSubMenu();
            this.showMainBattleMenu();
            return;
        }
        if (input === 'OK') {
            this.hideMainBattleMenu();
            this.showMonsterAttackSubMenu();
            return;
        }

        this.#updateSelectedBattleMenuOptionFromInput(input);
        this.#moveMainBattleMenuCursor();
    }

    #createMainBattleMenu() {
        this.#battleTextGameObjectLine1 = this.#scene.add.text(
            20, 
            468, 
            'what should', 
            battleUiTextStyle
        );
        //TODO: update to use monster data that is passed into this class instance
        this.#battleTextGameObjectLine2 = this.#scene.add.text(
            20, 
            512, 
            `${MONSTER_ASSET_KEYS.IGUANIGNITE} do next?`, 
            battleUiTextStyle
        );

        this.#mainBattleMenuCursorPhaserImageGameObject = this.#scene.add.image(BATTLE_MENU_CURSOR_POS.x, BATTLE_MENU_CURSOR_POS.y, UI_ASSET_KEYS.CURSOR, 0).setOrigin(0.5).setScale(2.5);

        this.#mainBattleMenuPhaserContainerGameObject = this.#scene.add.container(
            520, 
            448, 
            [
                this.#createMainInfoSubPane(),
                this.#scene.add.text(
                    55, 
                    22, 
                    BATTLE_MENU_OPTIONS.FIGHT, 
                    battleUiTextStyle
                ),
                this.#scene.add.text(
                    240, 
                    22, 
                    BATTLE_MENU_OPTIONS.SWITCH, 
                    battleUiTextStyle
                ),
                this.#scene.add.text(
                    55, 
                    70, 
                    BATTLE_MENU_OPTIONS.ITEM, 
                    battleUiTextStyle
                ),
                this.#scene.add.text(
                    240, 
                    70, 
                    BATTLE_MENU_OPTIONS.FLEE, 
                    battleUiTextStyle
                ),
                this.#mainBattleMenuCursorPhaserImageGameObject,
            ]
        );

        this.hideMainBattleMenu();
    }

    #createMonsterAttackSubMenu() {
        this.#attackBattleMenuCursorPhaserImageGameObject = this.#scene.add.image(42, 38, UI_ASSET_KEYS.CURSOR, 0).setOrigin(0.5).setScale(2.5);

        this.#moveSelectionSubBattleMenuPhaserContainerGameObject = this.#scene.add.container(0, 448, [
            this.#scene.add.text(55, 22, 'slash', battleUiTextStyle),
            this.#scene.add.text(240, 22, 'growl', battleUiTextStyle),
            this.#scene.add.text(55, 70, '-', battleUiTextStyle),
            this.#scene.add.text(240, 70, '-', battleUiTextStyle),
            this.#attackBattleMenuCursorPhaserImageGameObject,
        ]);
        this.hideMonsterAttackSubMenu();
    }

    #createMainInfoPane() {
        const padding = 4;
        const rectHeight = 124;

        this.#scene.add
            .rectangle(
                padding, 
                this.#scene.scale.height - rectHeight - padding, 
                this.#scene.scale.width - padding * 2, 
                rectHeight, 
                0xede4f3, 
                1
            )
            .setOrigin(0)
            .setStrokeStyle(8, 0xe4434a, 1);
    }

    #createMainInfoSubPane() {
        const rectWidth = 500;
        const rectHeight = 124;
         return this.#scene.add
            .rectangle(0, 0, rectWidth, rectHeight, 0xede4f3, 1)
            .setOrigin(0)
            .setStrokeStyle(8, 0x905ac2, 1);
    }

    /**
     * 
     * @param {import('../../../common/direction.js').Direction} direction 
     */
    #updateSelectedBattleMenuOptionFromInput(direction) {
        if (this.#selectedBattleMenuOption === BATTLE_MENU_OPTIONS.FIGHT) {
            switch(direction) {
                case DIRECTION.RIGHT:
                    this.#selectedBattleMenuOption = BATTLE_MENU_OPTIONS.SWITCH;
                    return;
                case DIRECTION.DOWN:
                    this.#selectedBattleMenuOption = BATTLE_MENU_OPTIONS.ITEM;
                    return;
                case DIRECTION.LEFT:
                case DIRECTION.UP:
                case DIRECTION.NONE:
                    return;
                default:
                    exhaustiveGuard(direction);
            }
            return;
        }

        if (this.#selectedBattleMenuOption === BATTLE_MENU_OPTIONS.SWITCH) {
            switch(direction) {
                case DIRECTION.LEFT:
                    this.#selectedBattleMenuOption = BATTLE_MENU_OPTIONS.FIGHT;
                    return;
                case DIRECTION.DOWN:
                    this.#selectedBattleMenuOption = BATTLE_MENU_OPTIONS.FLEE;
                    return;
                case DIRECTION.RIGHT:
                case DIRECTION.UP:
                case DIRECTION.NONE:
                    return;
                default:
                    exhaustiveGuard(direction);
            }
            return;
        }

        if (this.#selectedBattleMenuOption === BATTLE_MENU_OPTIONS.ITEM) {
            switch(direction) {
                case DIRECTION.RIGHT:
                    this.#selectedBattleMenuOption = BATTLE_MENU_OPTIONS.FLEE;
                    return;
                case DIRECTION.UP:
                    this.#selectedBattleMenuOption = BATTLE_MENU_OPTIONS.FIGHT;
                    return;
                case DIRECTION.LEFT:
                case DIRECTION.DOWN:
                case DIRECTION.NONE:
                    return;
                default:
                    exhaustiveGuard(direction);
            }
            return;
        }

        if (this.#selectedBattleMenuOption === BATTLE_MENU_OPTIONS.FLEE) {
            switch(direction) {
                case DIRECTION.LEFT:
                    this.#selectedBattleMenuOption = BATTLE_MENU_OPTIONS.ITEM;
                    return;
                case DIRECTION.UP:
                    this.#selectedBattleMenuOption = BATTLE_MENU_OPTIONS.SWITCH;
                    return;
                case DIRECTION.RIGHT:
                case DIRECTION.DOWN:
                case DIRECTION.NONE:
                    return;
                default:
                    exhaustiveGuard(direction);
            }
            return;
        }

        exhaustiveGuard(this.#selectedBattleMenuOption);
    }

    #moveMainBattleMenuCursor() {
        switch (this.#selectedBattleMenuOption) {
            case BATTLE_MENU_OPTIONS.FIGHT:
                this.#mainBattleMenuCursorPhaserImageGameObject.setPosition(BATTLE_MENU_CURSOR_POS.x, BATTLE_MENU_CURSOR_POS.y);
                return;
            case BATTLE_MENU_OPTIONS.SWITCH:
                this.#mainBattleMenuCursorPhaserImageGameObject.setPosition(228, BATTLE_MENU_CURSOR_POS.y);
                return;
            case BATTLE_MENU_OPTIONS.ITEM:
                this.#mainBattleMenuCursorPhaserImageGameObject.setPosition(BATTLE_MENU_CURSOR_POS.x, 86);
                return;
            case BATTLE_MENU_OPTIONS.FLEE:
                this.#mainBattleMenuCursorPhaserImageGameObject.setPosition(228, 86);
                return;
            default:
                exhaustiveGuard(this.#selectedBattleMenuOption);
        }
    }
}