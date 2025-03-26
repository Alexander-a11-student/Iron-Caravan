import { _decorator, Component, Node, Vec3, tween } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('UIManager')
export class UIManager extends Component {
    @property({ type: [Node] })
    private allBuildingsUI: Node[] = []; // Массив всех зданий

    public hideBuildings(nameBuildingLabel: Node, activeButtons: Node[]) {
        for (const buildingUI of this.allBuildingsUI) {
            // Проверяем, совпадает ли buildingUI с nameBuildingLabel
            if (buildingUI.name === nameBuildingLabel.name) {
                continue;
            }
    
            // Проверяем, совпадает ли buildingUI с одним из activeButtons
            let isActiveButton = false;
            for (const button of activeButtons) {
                if (button === buildingUI) {
                    isActiveButton = true;
                    break;
                }
            }
    
            // Если это активная кнопка, пропускаем её
            if (isActiveButton) {
                continue;
            }
    
            // Скрываем элемент
            console.log("Hiding building UI element:", buildingUI.name);
            buildingUI.active = false;
        }
    }
}


