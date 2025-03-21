import { _decorator, Component, Node, Camera, EventTouch, Vec2, Vec3 } from 'cc';
const { ccclass, property } = _decorator;

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

    private lastTouchPos: Vec2 | null = null;
    private initialDistance: number | null = null;
    private velocity: Vec2 = new Vec2(0, 0);
    private fingerSpeed: Vec2 = new Vec2(0, 0);
    private isZooming: boolean = false;
    private moveDelay: number = 100; // Задержка в миллисекундах
    private moveDelayTimer: number | null = null;
    private impulseMultiplier: number = 2; // Множитель начальной скорости инерции
    private friction: number = 0.95; // Коэффициент трения для затухания

    start() {
        this.node.on(Node.EventType.TOUCH_START, this.onTouchStart, this);
        this.node.on(Node.EventType.TOUCH_MOVE, this.onTouchMove, this);
        this.node.on(Node.EventType.TOUCH_END, this.onTouchEnd, this);
        this.node.on(Node.EventType.TOUCH_CANCEL, this.onTouchEnd, this);
    }

    onTouchStart(event: EventTouch) {
        const touches = event.getTouches();
        console.log("Touch start, number of touches:", touches.length);
    
        // Сбрасываем скорость инерции при новом касании
        this.velocity.set(0, 0);
    
        if (touches.length === 1) {
            this.lastTouchPos = touches[0].getLocation();
            this.isZooming = false;
        } 
    }
    
    onTouchMove(event: EventTouch) {
        const touches = event.getTouches();
        console.log("Touch move, number of touches:", touches.length);
    
        if (touches.length === 1 && this.lastTouchPos && !this.isZooming) {
            
            
            
            // Сбрасываем инерцию при начале движения пальцем
            this.velocity.set(0, 0);
    
            const currentTouchPos = touches[0].getLocation();
            console.log("Touch move position:", currentTouchPos);
    
            const deltaX = currentTouchPos.x - this.lastTouchPos.x;
            const deltaY = currentTouchPos.y - this.lastTouchPos.y;
            this.fingerSpeed.set(deltaX, deltaY);
    
            this.lastTouchPos = currentTouchPos;

            // Вычисляем расстояние, которое проходит палец
            const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);

            // Устанавливаем порог для игнорирования резких движений
            const movementThreshold = 50; // Порог в пикселях

            if (distance > movementThreshold) {
                console.log("Movement ignored due to large distance:", distance);
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
                console.log("Initial distance set in onTouchMove:", this.initialDistance);
                return;
            }

            // Вычисляем изменение расстояности и коэффициент зума
            console.log("Current distance:", currentDistance, "Initial distance:", this.initialDistance);
            const zoomFactor = (currentDistance - this.initialDistance) * 0.5; // Коэффициент зума
            this.initialDistance = currentDistance; // Обновляем начальное расстояние

            if (this.camera) {
                const currentOrthoHeight = this.camera.orthoHeight;
                const newOrthoHeight = Math.min(this.maxOrthoHeight, Math.max(this.minOrthoHeight, currentOrthoHeight - zoomFactor));
                console.log("New ortho height:", newOrthoHeight);
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
    
    update(deltaTime: number) {
        if (this.velocity.length() > 0.1) {
            if (this.camera) {
                const cameraPos = this.camera.node.position;
                const newX = Math.min(this.maxX, Math.max(this.minX, cameraPos.x - this.velocity.x * deltaTime));
                const newY = Math.min(this.maxY, Math.max(this.minY, cameraPos.y - this.velocity.y * deltaTime));
                this.camera.node.setPosition(newX, newY, cameraPos.z);
            }
            // Замедляем затухание до 0.99 для более длительного движения
            this.velocity.multiplyScalar(0.99);
        } else {
            this.velocity.set(0, 0);
        }
    }
}