import { _decorator, Component, Node, Camera, EventTouch, Input, input, Vec2, Vec3, EventMouse, UITransform, Label, tween, v3, v2 } from 'cc';
import { TileCoords, TileType } from './TileType';
import { MapTile } from './MapTile';
const { ccclass, property } = _decorator;

@ccclass('TerrainInfoController')
export class TerrainInfoController extends Component {
    @property(Camera)
    mainCamera: Camera = null!;

    @property(Node)
    terrainNode: Node = null!; // Нода, содержащая все тайлы ландшафта

    @property(Label)
    terrainLabelPrefab: Label = null!; // Префаб Label для отображения типа ландшафта

    private longPressTimer: number = 0;
    private longPressThreshold: number = 1.5; // 1 секунда
    private longPressActive: boolean = false;
    private currentTouchPos: Vec2 = new Vec2();

    onLoad() {
        // Подписываемся на события
        input.on(Input.EventType.TOUCH_START, this.onTouchStart, this);
        input.on(Input.EventType.TOUCH_END, this.onTouchEnd, this);
        input.on(Input.EventType.TOUCH_CANCEL, this.onTouchEnd, this);
        input.on(Input.EventType.TOUCH_MOVE, this.onTouchMove, this);

        input.on(Input.EventType.MOUSE_DOWN, this.onMouseDown, this);
        input.on(Input.EventType.MOUSE_UP, this.onMouseUp, this);
        input.on(Input.EventType.MOUSE_MOVE, this.onMouseMove, this);
    }

    onDestroy() {
        // Отписываемся от событий
        input.off(Input.EventType.TOUCH_START, this.onTouchStart, this);
        input.off(Input.EventType.TOUCH_END, this.onTouchEnd, this);
        input.off(Input.EventType.TOUCH_CANCEL, this.onTouchEnd, this);
        input.off(Input.EventType.TOUCH_MOVE, this.onTouchMove, this);

        input.off(Input.EventType.MOUSE_DOWN, this.onMouseDown, this);
        input.off(Input.EventType.MOUSE_UP, this.onMouseUp, this);
        input.off(Input.EventType.MOUSE_MOVE, this.onMouseMove, this);
    }

    update(deltaTime: number) {
        if (this.longPressTimer > 0) {
            this.longPressTimer += deltaTime;
            if (this.longPressTimer >= this.longPressThreshold && !this.longPressActive) {
                this.showTerrainType();
                this.longPressActive = true;
            }
        }
    }

    // Обработчики событий
    onTouchStart(event: EventTouch) {
        this.startLongPress(event.getLocation());
    }

    onMouseDown(event: EventMouse) {
        if (event.getButton() === 0) { // Левая кнопка мыши
            this.startLongPress(event.getLocation());
        }
    }

    startLongPress(pos: Vec2) {
        this.currentTouchPos = pos.clone();
        this.longPressTimer = 0.01; // Начинаем отсчёт
        this.longPressActive = false;
    }

    onTouchMove(event: EventTouch) {
        this.handleMove(event.getLocation());
    }

    onMouseMove(event: EventMouse) {
        if (this.longPressTimer > 0) {
            this.handleMove(event.getLocation());
        }
    }

    handleMove(pos: Vec2) {
        const moveDelta = pos.clone().subtract(this.currentTouchPos);
        if (moveDelta.length() > 10) { // Если палец/мышь сдвинулись достаточно далеко
            this.cancelLongPress();
        }
    }

    cancelLongPress() {
        this.longPressTimer = 0;
        this.longPressActive = false;
    }

    onTouchEnd() {
        this.cancelLongPress();
    }

    onMouseUp() {
        this.cancelLongPress();
    }

    showTerrainType() {
        const worldPos = this.mainCamera.screenToWorld(
            new Vec3(this.currentTouchPos.x, this.currentTouchPos.y, 0)
        );

        const tileNode = this.findTileAtPosition(worldPos);
        if (!tileNode) return;

        const terrainType = this.getTerrainType(tileNode);
        this.displayTerrainLabel(terrainType, worldPos);
    }

    findTileAtPosition(worldPos: Vec3): MapTile | null {
        const children = this.terrainNode.children;

        for (const child of children) {
            const uiTransform = child.getComponent(UITransform);
            if (uiTransform && uiTransform.getBoundingBox().contains(v2(worldPos.x, worldPos.y))) {
                return child;
            }
        }
        return null;
    }

    getTerrainType(tileNode: Node): string {
        // Реализуйте логику определения типа ландшафта
        // Например, из компонента TerrainTile или имени ноды
        return tileNode.name; // Временная реализация
    }

    displayTerrainLabel(terrainType: string, position: Vec3) {
        const labelNode = new Node('TerrainLabel');
        const label = labelNode.addComponent(Label);

        label.string = terrainType;
        label.fontSize = 24;
        label.lineHeight = 24;
        label.color.set(255, 255, 255, 255);

        this.node.parent.addChild(labelNode);
        labelNode.setPosition(position.x, position.y + 50, 0);

        // Анимация
        labelNode.scale = v3(0.5, 0.5, 1);
        tween(labelNode)
            .to(0.2, { scale: v3(1, 1, 1) })
            .delay(1.5)
            .to(0.3, { position: v3(labelNode.position.x, labelNode.position.y + 30, 0), opacity: 0 })
            .call(() => labelNode.destroy())
            .start();
    }
}