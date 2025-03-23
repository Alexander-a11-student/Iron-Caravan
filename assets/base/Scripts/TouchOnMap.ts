import { _decorator, Component, Node, EventTouch, log, Vec3, Vec2, tween, Tween } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('TouchOnMap')
export class TouchOnMap extends Component {
    private originalScale: Vec3 = new Vec3();
    private touchStartTime: number = 0; // Время начала касания
    private touchStartPos: Vec2 = new Vec2(); // Позиция начала касания
    private isDragging: boolean = false; // Флаг перемещения

    private static eventTarget = new EventTarget(); // Локальный EventTarget для передачи событий

    // Фактор увеличения здания при касании (например, 1.1 = увеличение до 110% от исходного размера)
    private scaleFactor: number = 0.95;
    // Длительность анимации (в секундах)
    private animationDuration: number = 0.1;
    // Задержка перед возвращением к исходному масштабу (в секундах)
    private returnDelay: number = 0.1; // 800 миллисекунд

    // Переменная для хранения текущей анимации (чтобы можно было её остановить)
    private currentTween: Tween<Node> | null = null;

    start() {
        // Сохраняем оригинальный масштаб здания
        this.originalScale.set(this.node.scale);
        log('Original scale:', this.originalScale);

        // Добавляем обработчики событий
        this.node.on(Node.EventType.TOUCH_START, this.onTouchStart, this);
        this.node.on(Node.EventType.TOUCH_MOVE, this.onTouchMove, this);
        this.node.on(Node.EventType.TOUCH_END, this.onTouchEnd, this);
        this.node.on(Node.EventType.TOUCH_CANCEL, this.onTouchCancel, this);
    }

    onTouchStart(event: EventTouch) {
        log('Touch started on building:', this.node.name);

        // Сохраняем время и позицию начала касания
        this.touchStartTime = Date.now();
        this.touchStartPos = event.getLocation();
        this.isDragging = false; // Сбрасываем флаг перемещения
    }

    onTouchMove(event: EventTouch) {
        const currentPos = event.getLocation();
        const delta = currentPos.subtract(this.touchStartPos).length();

        // Если дельта больше порога, считаем, что это перемещение
        const dragThreshold = 10; // Порог перемещения в пикселях
        if (delta > dragThreshold) {
            this.isDragging = true;
        }
    }

    onTouchEnd(event: EventTouch) {
        const touchDuration = Date.now() - this.touchStartTime;

        if (!this.isDragging && touchDuration < 300) {
            // Если это короткое касание без перемещения, считаем, что это нажатие
            log('Building clicked:', this.node.name);

            // Останавливаем предыдущую анимацию, если она есть
            if (this.currentTween) {
                this.currentTween.stop();
            }

            // Вычисляем целевой масштаб (увеличенный)
            const targetScale = new Vec3(
                this.originalScale.x * this.scaleFactor,
                this.originalScale.y * this.scaleFactor,
                this.originalScale.z
            );

            // Запускаем анимацию увеличения
            this.currentTween = tween(this.node)
                .to(this.animationDuration, { scale: targetScale }, { easing: 'linear' })
                // Задержка перед возвращением к исходному масштабу
                .delay(this.returnDelay)
                // Анимация возвращения к исходному масштабу
                .to(this.animationDuration, { scale: this.originalScale }, { easing: 'linear' })
                .start();

            log('New scale:', this.node.scale);
        } else {
            log('Touch ended, but it was a drag, not a click.');
        }
    }

    onTouchCancel(event: EventTouch) {
        log('Touch canceled on building:', this.node.name);

        // Останавливаем текущую анимацию, если она есть
        if (this.currentTween) {
            this.currentTween.stop();
        }

        // Возвращаем исходный масштаб
        this.currentTween = tween(this.node)
            .to(this.animationDuration, { scale: this.originalScale }, { easing: 'linear' })
            .start();
    }

    // Очистка при уничтожении компонента
    onDestroy() {
        // Удаляем обработчики событий
        this.node.off(Node.EventType.TOUCH_START, this.onTouchStart, this);
        this.node.off(Node.EventType.TOUCH_MOVE, this.onTouchMove, this);
        this.node.off(Node.EventType.TOUCH_END, this.onTouchEnd, this);
        this.node.off(Node.EventType.TOUCH_CANCEL, this.onTouchCancel, this);

        // Останавливаем анимацию, если она активна
        if (this.currentTween) {
            this.currentTween.stop();
        }
    }
}