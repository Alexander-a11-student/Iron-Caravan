import { _decorator, Component, log, Node, Label } from 'cc';

import { GameCtrl } from '../GameCtrl';
import { TouchOnUI } from '../TouchOnUI';

const { ccclass, property } = _decorator;

@ccclass('EnergyStorage')
export class EnergyStorage extends Component {

    @property({ type: Node })
    buildingLevelLabel: Node  = null; 

    @property({ type: Node })
    buildingLabel: Node  = null; 
    
    // Метод для управления видимостью надписей
    public updateLabelsVisibility(isActive: boolean) {
        if (this.buildingLabel) {
            this.buildingLabel.active = isActive;
        }
        if (this.buildingLabel) {
            this.buildingLabel.active = isActive;
        }
    }

    @property
    capacity: number = 100;

    @property
    level: number = 1;

    @property
    currentRecource: number;

    @property ({type: [Number]})
    upgradeCosts: number[];


    start() {

        // Загружаем прогресс из GameCtrl
        const savedLevel = GameCtrl.instance.getBuildingLevel(this.node.name);
        console.log(savedLevel);
        if (savedLevel > 0 ) {
            // Если есть сохранённый уровень, используем его
            this.level = savedLevel;
        } else {
            // Если здание не зарегистрировано, регистрируем его
            GameCtrl.instance.registerBuilding(this.node.name, this.level);
        }

        // Устанавливаем характеристики в зависимости от уровня
        this.updateSpec();

        TouchOnUI.eventTarget.on('StorageEnergy', this.onUpgradeBuilding, this);
    }

    // Метод для обновления характеристик
    public updateSpec() {
        this.level = GameCtrl.instance.getBuildingLevel(this.node.name);
        this.capacity = 100 + (this.level - 1) * 50; // Пример расчёта capacity
        log(`EnergyStorage updated: Level ${this.level}, Capacity ${this.capacity}`);
    }

    onUpgradeBuilding() {
        console.log(this.currentRecource);
        const upgradeCost = this.upgradeCosts[this.level - 1]; // Получаем стоимость для текущего уровня
        if (this.level < 10 && this.currentRecource >= upgradeCost) {
            this.currentRecource -= upgradeCost; // Вычитаем стоимость из текущего ресурса
            this.level++;
            GameCtrl.instance.setBuildingLevel(this.node.name, this.level);
            this.updateSpec();

            //Обновить состояние buildingLevelLabel здания после апгрейда
            if (this.buildingLevelLabel) {
                this.buildingLevelLabel.getComponent(Label).string = `Level: ${this.level}`;
            }
            console.log(this.currentRecource);

        } 
    }

    onDestroy() {
        // Отписываемся от события, чтобы избежать утечек памяти
        TouchOnUI.eventTarget.off('StorageEnergy', this.onUpgradeBuilding, this);
    }


}


