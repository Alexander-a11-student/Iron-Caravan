import { _decorator, Component, log } from 'cc';
import { GameCtrl } from './GameCtrl';
const { ccclass, property } = _decorator;

@ccclass('TownHoll')
export class TownHoll extends Component {
    @property
    HP: number = 1000;

    @property
    level: number = 1;

    start() {
        // Регистрируем здание в GameCtrl
        GameCtrl.instance.registerBuilding(this.node.name, this.level);

        // Устанавливаем характеристики в зависимости от уровня
        this.updateSpec();
    }

    // Метод для обновления характеристик
    public updateSpec() {
        this.level = GameCtrl.instance.getBuildingLevel(this.node.name);
        this.HP = 1000 + (this.level - 1) * 200; // Пример расчёта HP
        log(`TownHoll updated: Level ${this.level}, HP ${this.HP}`);
    }
}


