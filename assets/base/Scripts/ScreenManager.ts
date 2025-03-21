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

    start() {
        this.node.on(Node.EventType.TOUCH_MOVE, this.onTouchMove, this);
        this.node.on(Node.EventType.TOUCH_START, this.onTouchStart, this);
        this.node.on(Node.EventType.TOUCH_END, this.onTouchEnd, this);
        this.node.on(Node.EventType.TOUCH_CANCEL, this.onTouchEnd, this);
    }

    onTouchStart(event: EventTouch) {
        const touches = event.getTouches();
        if (touches.length === 1) {
            this.lastTouchPos = touches[0].getLocation();
            console.log("Touch start position:", this.lastTouchPos);
        } else if (touches.length === 2) {
            const touch1 = touches[0].getLocation();
            const touch2 = touches[1].getLocation();
            this.initialDistance = Vec2.distance(touch1, touch2);
        }
    }

    onTouchMove(event: EventTouch) {
        const touches = event.getTouches();

        if (touches.length === 1 && this.lastTouchPos) {
            const currentTouchPos = touches[0].getLocation();
            console.log("Touch move position:", currentTouchPos);

            let deltaX = currentTouchPos.x - this.lastTouchPos.x;
            let deltaY = currentTouchPos.y - this.lastTouchPos.y;
            console.log("Delta:", deltaX, deltaY);
            this.lastTouchPos = currentTouchPos;

            if (this.camera) {
                const cameraPos = this.camera.node.position;
                const newX = Math.min(this.maxX, Math.max(this.minX, cameraPos.x + deltaX * 0.5));
                const newY = Math.min(this.maxY, Math.max(this.minY, cameraPos.y + deltaY * 0.5));
                this.camera.node.setPosition(newX, newY, cameraPos.z);
            }
        } else if (touches.length === 2 && this.initialDistance !== null) {
            const touch1 = touches[0].getLocation();
            const touch2 = touches[1].getLocation();
            const currentDistance = Vec2.distance(touch1, touch2);

            const zoomFactor = (currentDistance - this.initialDistance) * 0.01;
            this.initialDistance = currentDistance;

            if (this.camera) {
                const currentOrthoHeight = this.camera.orthoHeight;
                const newOrthoHeight = Math.min(this.maxOrthoHeight, Math.max(this.minOrthoHeight, currentOrthoHeight - zoomFactor));
                this.camera.orthoHeight = newOrthoHeight;
            }
        }
    }

    onTouchEnd(event: EventTouch) {
        this.lastTouchPos = null;
        this.initialDistance = null;
    }

}
