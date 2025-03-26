import { _decorator, Component, director } from 'cc';
const { ccclass, property } = _decorator;

import { TouchOnMap } from './TouchOnMap';

@ccclass('GameCtrl')
export class GameCtrl extends Component {
    private static _instance: GameCtrl;

    // Хранилище данных о зданиях (название и уровень)
    private buildings: Map<string, number> = new Map();

    // Ссылка на текущее активное здание
    private currentBuilding: TouchOnMap | null = null;

    public static get instance() {
        if (!this._instance) {
            this._instance = new GameCtrl();
        }
        return this._instance;
    }

    onLoad() {
        // Проверяем, существует ли уже экземпляр GameCtrl
        if (GameCtrl._instance) {
            // Если экземпляр уже существует, удаляем текущий узел
            this.node.destroy();
            return;
        }

        // Устанавливаем текущий экземпляр
        GameCtrl._instance = this;

        // Делаем узел персистентным (неуничтожаемым при смене сцены)
        director.addPersistRootNode(this.node);

    }

    // Метод для регистрации здания

    public registerBuilding(name: string, level: number) {
        this.buildings.set(name, level);
    }

    // Метод для получения уровня здания
    public getBuildingLevel(name: string): number {
        return this.buildings.get(name) || 0; // Если здание не зарегистрировано, возвращаем уровень 1
    }

    // Метод для обновления уровня здания
    public setBuildingLevel(name: string, level: number) {
        if (this.buildings.has(name)) {
            this.buildings.set(name, level);
        }
    }

    // Метод для установки активного здания
    public setActiveBuilding(newBuilding: TouchOnMap) {

        // Скрываем надписи у предыдущего активного здания
        if (this.currentBuilding && this.currentBuilding !== newBuilding) {
            this.currentBuilding.isActive = false; // Скрываем надписи и кнопку
        }
        // Устанавливаем новое активное здание
        this.currentBuilding = newBuilding;
    }
}

