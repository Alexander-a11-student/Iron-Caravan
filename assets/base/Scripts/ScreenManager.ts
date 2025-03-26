import { _decorator, Component, Node, Camera, EventTouch, Vec2} from 'cc';
const { ccclass, property } = _decorator;

import { UIManager } from './UIManager';

@ccclass('ScreenManager')
export class ScreenManager extends Component {
    @property(Camera)
    camera: Camera | null = null;

    @property
    minX: number = -1000;

    @property
    maxX: number = 1000;

    @property
    minY: number = -1000;

    @property
    maxY: number = 1000;

    @property
    minOrthoHeight: number = 200;

    @property
    maxOrthoHeight: number = 600;

    private UIManager: UIManager; // Ссылка на менеджер UI
    
    onLoad() {
        // Ищем UIManager в сцене и инициализируем его
        const uiManagerNode = this.node.scene.getChildByName('UIManager');
        if (uiManagerNode) {
            this.UIManager = uiManagerNode.getComponent(UIManager);
        } 
    }



    private lastTouchPos: Vec2 | null = null;
    private initialDistance: number | null = null;
    private velocity: Vec2 = new Vec2(0, 0);
    private fingerSpeed: Vec2 = new Vec2(0, 0);
    private isZooming: boolean = false;
    private moveDelayTimer: number | null = null;

    start() {
        this.node.on(Node.EventType.TOUCH_START, this.onTouchStart, this);
        this.node.on(Node.EventType.TOUCH_MOVE, this.onTouchMove, this);
        this.node.on(Node.EventType.TOUCH_END, this.onTouchEnd, this);
        this.node.on(Node.EventType.TOUCH_CANCEL, this.onTouchEnd, this);
    }

    onTouchStart(event: EventTouch) {
        const touches = event.getTouches();
       
        if (touches.length === 1) {
            this.lastTouchPos = touches[0].getLocation();
            this.isZooming = false;
        } 

    }
    
    onTouchMove(event: EventTouch) {
        const touches = event.getTouches();
    
        if (touches.length === 1 && this.lastTouchPos && !this.isZooming) {
            
            
            
            // Сбрасываем инерцию при начале движения пальцем
            this.velocity.set(0, 0);
    
            const currentTouchPos = touches[0].getLocation();
    
            const deltaX = currentTouchPos.x - this.lastTouchPos.x;
            const deltaY = currentTouchPos.y - this.lastTouchPos.y;
            this.fingerSpeed.set(deltaX, deltaY);
    
            this.lastTouchPos = currentTouchPos;

            // Вычисляем расстояние, которое проходит палец
            const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);

            // Устанавливаем порог для игнорирования резких движений
            const movementThreshold = 50; // Порог в пикселях

            if (distance > movementThreshold) {
                return; // Игнорируем движение, если оно слишком резкое
            }

    
            if (this.camera) {
                const cameraPos = this.camera.node.position;
                const newX = Math.min(this.maxX, Math.max(this.minX, cameraPos.x - deltaX * 0.5));
                const newY = Math.min(this.maxY, Math.max(this.minY, cameraPos.y - deltaY * 0.5));
                this.camera.node.setPosition(newX, newY, cameraPos.z);
            }
            
        } else if (touches.length >= 2) {
            
            //this.velocity.set(0, 0);

            this.isZooming = true;
            const touch1 = touches[0].getLocation();
            const touch2 = touches[1].getLocation();
            const currentDistance = Vec2.distance(touch1, touch2);

            // Если начальное расстояние еще не установлено, задаем его
            if (this.initialDistance === null) {
                this.initialDistance = currentDistance;
                return;
            }

            const zoomFactor = (currentDistance - this.initialDistance) * 0.3; // Коэффициент зума
            this.initialDistance = currentDistance; // Обновляем начальное расстояние

            if (this.camera) {
                const currentOrthoHeight = this.camera.orthoHeight;
                const newOrthoHeight = Math.min(this.maxOrthoHeight, Math.max(this.minOrthoHeight, currentOrthoHeight - zoomFactor));
                this.camera.orthoHeight = newOrthoHeight;
            }
        }
    }
    
    onTouchEnd(event: EventTouch) {
        if (this.lastTouchPos && !this.isZooming) {
            // Увеличиваем начальную скорость инерции до 10 для более выраженного эффекта
            this.velocity.set(this.fingerSpeed.x * 60, this.fingerSpeed.y * 60);
        }
        this.lastTouchPos = null;
        this.initialDistance = null;
        this.isZooming = false;
        if (this.moveDelayTimer !== null) {
            clearTimeout(this.moveDelayTimer);
            this.moveDelayTimer = null;
        }
    }

    
}