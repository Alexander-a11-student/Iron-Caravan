import { _decorator, Component, Node, EventTouch, log, Vec3, tween, Tween, EventTarget, CCString, Sprite } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('TouchOnUI')
export class TouchOnUI extends Component {


    @property ({type: CCString})
    private nameAction: string = '';
    public static eventTarget: EventTarget = new EventTarget();

    // Переменная для хранения текущей анимации (чтобы можно было её остановить)
    private currentTween: Tween<Node> | null = null;

    start() {
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

        this.currentTween = tween(this.node)
        .to(0.1, { scale: new Vec3(0.8, 0.8, 0.8) }, { easing: 'backOut' }) // Эффект "отскока"
        .call(() => {
            this.currentTween = null; // Сбрасываем текущую анимацию после завершения
        })
        .start();

    }

    onTouchEnd(event: EventTouch) {
        // Останавливаем текущую анимацию, если она есть
        if (this.currentTween) {
            this.currentTween.stop();
        }

        this.currentTween = tween(this.node)
        .to(0.1, { scale: new Vec3(1, 1, 1) }, { easing: 'backOut' }) // Эффект "отскока"
        .call(() => {
            this.currentTween = null; // Сбрасываем текущую анимацию после завершения
        })
        .start();

        // Вызываем метод для обработки нажатия на кнопку
        this.ActionOnClickButton();
    }

    onTouchCancel(event: EventTouch) {
        // При отмене касания делаем то же, что и при TOUCH_END
        this.onTouchEnd(event);
    }


    ActionOnClickButton() {
        TouchOnUI.eventTarget.emit(this.nameAction);
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