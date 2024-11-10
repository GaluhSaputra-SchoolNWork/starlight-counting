import { DATA_ASSETS_KEYS } from "../assets/asset-keys.js";

export class DataUtils {
    static getMonsterAttack(scene, attackId) {
        /** @type { import("../types/typedef.js").Attack[] } */
        const data = scene.cache.json.get(DATA_ASSETS_KEYS.ATTACKS)
        return data.find((attack) => attack.id === attackId)
    }
}