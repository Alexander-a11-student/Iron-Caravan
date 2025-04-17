import { _decorator, Component, Node, Camera, EventTouch, Input, input, Vec2, Vec3, EventMouse } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('CameraController')
export class CameraController extends Component {
    @property(Camera)
    mainCamera: Camera = null!;

    private isDragging: boolean = false;
    private lastTouchPos: Vec2 = new Vec2();
    private cameraSpeed: number = 2 ;

    onLoad() {
        // Подписываемся на события мыши и тача
        input.on(Input.EventType.TOUCH_START, this.onTouchStart, this);
        input.on(Input.EventType.TOUCH_MOVE, this.onTouchMove, this);
        input.on(Input.EventType.TOUCH_END, this.onTouchEnd, this);
        input.on(Input.EventType.TOUCH_CANCEL, this.onTouchEnd, this);

        input.on(Input.EventType.MOUSE_DOWN, this.onMouseDown, this);
        input.on(Input.EventType.MOUSE_MOVE, this.onMouseMove, this);
        input.on(Input.EventType.MOUSE_UP, this.onMouseUp, this);
    }

    onDestroy() {
        // Отписываемся от событий при уничтожении компонента
        input.off(Input.EventType.TOUCH_START, this.onTouchStart, this);
        input.off(Input.EventType.TOUCH_MOVE, this.onTouchMove, this);
        input.off(Input.EventType.TOUCH_END, this.onTouchEnd, this);
        input.off(Input.EventType.TOUCH_CANCEL, this.onTouchEnd, this);

        input.off(Input.EventType.MOUSE_DOWN, this.onMouseDown, this);
        input.off(Input.EventType.MOUSE_MOVE, this.onMouseMove, this);
        input.off(Input.EventType.MOUSE_UP, this.onMouseUp, this);
    }

    // Обработчики тач-событий
    onTouchStart(event: EventTouch) {
        this.isDragging = true;
        this.lastTouchPos = event.getLocation();
    }

    onTouchMove(event: EventTouch) {
        if (!this.isDragging) return;

        const currentPos = event.getLocation();
        const delta = new Vec2(currentPos.x - this.lastTouchPos.x, currentPos.y - this.lastTouchPos.y);

        this.moveCamera(delta);
        this.lastTouchPos = currentPos;
    }

    onTouchEnd() {
        this.isDragging = false;
    }

    // Обработчики событий мыши
    onMouseDown(event: EventMouse) {
        if (event.getButton() === 0) { // Левая кнопка мыши
            this.isDragging = true;
            this.lastTouchPos = event.getLocation();
        }
    }

    onMouseMove(event: EventMouse) {
        if (!this.isDragging) return;

        const currentPos = event.getLocation();
        const delta = new Vec2(currentPos.x - this.lastTouchPos.x, currentPos.y - this.lastTouchPos.y);

        this.moveCamera(delta);
        this.lastTouchPos = currentPos;
    }

    onMouseUp() {
        this.isDragging = false;
    }

    // Перемещение камеры
    moveCamera(delta: Vec2) {
        const cameraNode = this.mainCamera.node;
        const moveDelta = new Vec3(-delta.x * this.cameraSpeed, -delta.y * this.cameraSpeed, 0);
        const newPos = cameraNode.position.add(moveDelta);

        // Установите свои границы
        const minX = -10000, maxX = 10000;
        const minY = -10000, maxY = 10000;

        newPos.x = Math.max(minX, Math.min(maxX, newPos.x));
        newPos.y = Math.max(minY, Math.min(maxY, newPos.y));

        cameraNode.position = newPos;
    }
}