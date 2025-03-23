import { _decorator, Component, Node, EventTouch, log, Vec3, tween, Tween } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('TouchOnMap')
export class TouchOnMap extends Component {
    private originalScale: Vec3 = new Vec3();
    private static eventTarget = new EventTarget(); // Локальный EventTarget для передачи событий

    // Фактор уменьшения кнопки при нажатии (например, 0.8 = уменьшение до 80% от исходного размера)
    private scaleFactor: number = 0.7;
    // Длительность анимации (в секундах)
    private animationDuration: number = 0.2;

    // Переменная для хранения текущей анимации (чтобы можно было её остановить)
    private currentTween: Tween<Node> | null = null;

    start() {
        // Сохраняем оригинальный масштаб кнопки (this.node — это сама кнопка)
        this.originalScale.set(this.node.scale);
        log('Original scale:', this.originalScale);

        // Добавляем обработчики событий для кнопки
        this.node.on(Node.EventType.TOUCH_START, this.onTouchStart, this);
        this.node.on(Node.EventType.TOUCH_END, this.onTouchEnd, this);
        this.node.on(Node.EventType.TOUCH_CANCEL, this.onTouchCancel, this);
    }

    onTouchStart(event: EventTouch) {
        // Останавливаем предыдущую анимацию, если она есть
        if (this.currentTween) {
            this.currentTween.stop();
        }

        // Вычисляем целевой масштаб (уменьшенный) для кнопки
        const targetScale = new Vec3(
            this.originalScale.x * this.scaleFactor,
            this.originalScale.y * this.scaleFactor,
            this.originalScale.z
        );

        // Запускаем анимацию уменьшения с помощью tween
        this.currentTween = tween(this.node)
            .to(this.animationDuration, { scale: targetScale }, { easing: 'linear' })
            .start();
    }

    onTouchEnd(event: EventTouch) {
        // Останавливаем текущую анимацию, если она есть
        if (this.currentTween) {
            this.currentTween.stop();
        }

        // Запускаем анимацию возвращения к исходному масштабу кнопки
        this.currentTween = tween(this.node)
            .to(this.animationDuration, { scale: this.originalScale }, { easing: 'linear' })
            .start();
    }

    onTouchCancel(event: EventTouch) {
        // При отмене касания делаем то же, что и при TOUCH_END
        this.onTouchEnd(event);
    }

    // Очистка при уничтожении компонента
    onDestroy() {
        // Удаляем обработчики событий
        this.node.off(Node.EventType.TOUCH_START, this.onTouchStart, this);
        this.node.off(Node.EventType.TOUCH_END, this.onTouchEnd, this);
        this.node.off(Node.EventType.TOUCH_CANCEL, this.onTouchCancel, this);

        // Останавливаем анимацию, если она активна
        if (this.currentTween) {
            this.currentTween.stop();
        }
    }
}