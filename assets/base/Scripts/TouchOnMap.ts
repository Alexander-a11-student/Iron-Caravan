import { _decorator, Component, Node, EventTouch, Vec3, Vec2, tween, Tween } from 'cc';
const { ccclass, property } = _decorator;

import { GameCtrl } from './GameCtrl';
import { UIManager } from './UIManager';

@ccclass('TouchOnMap')
export class TouchOnMap extends Component {

    private currentTweenBuilding: Tween<Node> | null = null;
    private currentTweenButtons: Map<Node, Tween<Node>> = new Map();

    public isActive: boolean = false; // Флаг активности (показывает, активны ли надписи)

    @property({ type: [Node] })
    public Buttons: Node[] = []; // Массив ссылок на кнопки апгрейда

    @property({ type: Node })
    public buildingLabel: Node | null = null; // Ссылка Label здания

    private UIManager: UIManager; // Ссылка на менеджер UI

    onLoad() {
        // Ищем UIManager в сцене и инициализируем его
        const uiManagerNode = this.node.scene.getChildByName('UIManager');
        if (uiManagerNode) {
            this.UIManager = uiManagerNode.getComponent(UIManager);
        }
    }




    private originalScale: Vec3 = new Vec3();
    private touchStartTime: number = 0; // Время начала касания
    private touchStartPos: Vec2 = new Vec2(); // Позиция начала касания
    private isDragging: boolean = false; // Флаг перемещения


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


        // Добавляем обработчики событий
        this.node.on(Node.EventType.TOUCH_START, this.onTouchStart, this);
        this.node.on(Node.EventType.TOUCH_MOVE, this.onTouchMove, this);
        this.node.on(Node.EventType.TOUCH_END, this.onTouchEnd, this);
        this.node.on(Node.EventType.TOUCH_CANCEL, this.onTouchCancel, this);
    }

    onTouchStart(event: EventTouch) {

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

            // Скрываем все надписи и кнопки у других зданий
            this.UIManager.hideBuildings(this.buildingLabel, this.Buttons);
            // Устанавливаем текущее здание как активное
            GameCtrl.instance.setActiveBuilding(this);
            // Переключаем состояние надписей и кнопки
            this.toggleBuildingState();

        } 
    }

    onTouchCancel(event: EventTouch) {
        // Останавливаем текущую анимацию, если она есть
        if (this.currentTween) {
            this.currentTween.stop();
        }

        // Возвращаем исходный масштаб
        this.currentTween = tween(this.node)
            .to(this.animationDuration, { scale: this.originalScale }, { easing: 'linear' })
            .start();
    }



    // Метод для переключения состояния надписей и кнопки
    private toggleBuildingState() {
        //this.UIManager.hideBuildings(this.buildingLabel, this.Buttons);

        this.isActive = !this.isActive; // Переключаем состояние

        // Управляем видимостью надписей
        if (this.buildingLabel) {
            this.buildingLabel.active = this.isActive;
            this.animateScale(this.buildingLabel, this.isActive);
        }

        this.animateButtons(this.isActive);
    }



    private animateScale(target: Node, isActive: boolean) {
        // Останавливаем текущую анимацию, если она есть
        if (this.currentTweenBuilding) {
            this.currentTweenBuilding.stop();
            this.currentTweenBuilding = null;
        }
    
        if (isActive) {
            // Если элемент активируется, увеличиваем scale

            target.active = true; // Делаем элемент видимым
            target.scale = new Vec3(0, 0, 0); // Устанавливаем начальный scale (нулевой)
    
            // Анимация увеличения scale до оригинального размера
            this.currentTweenBuilding = tween(target)
                .to(0.3, { scale: new Vec3(1, 1, 1) }, { easing: 'backOut' }) // Эффект "отскока"
                .call(() => {
                    this.currentTweenBuilding = null; // Сбрасываем текущую анимацию после завершения
                })
                .start();
        } else {
            target.active = true; 

            // Если элемент деактивируется, уменьшаем scale
            this.currentTweenBuilding = tween(target)
                .to(0.3, { scale: new Vec3(0, 0, 0) }, { easing: 'expoInOut' }) // Плавное уменьшение
                .call(() => {
                    target.active = false; // Делаем элемент невидимым после анимации
                    this.currentTweenBuilding = null; // Сбрасываем текущую анимацию после завершения
                })
                .start();
                
        }
    }


    private animateButtons(isActive: boolean) {
        if (!this.Buttons || this.Buttons.length === 0) {
            return;
        }
    
        // Останавливаем текущие анимации для всех кнопок
        this.currentTweenButtons.forEach((tween, button) => {
            tween.stop();
            this.currentTweenButtons.delete(button);
        });
    
        // Анимация кнопок с задержкой
        this.Buttons.forEach((button, index) => {
            // Проверяем, нужно ли анимировать кнопку
            if (isActive && button.active && button.scale.equals(new Vec3(1, 1, 1))) {
                // Кнопка уже активна и имеет нужный масштаб, пропускаем
                return;
            }
            if (!isActive && (!button.active || button.scale.equals(new Vec3(0, 0, 0)))) {
                // Кнопка уже неактивна или имеет нулевой масштаб, пропускаем
                return;
            }
    
            const delay = index * 0.1; // Задержка для каждой кнопки
    
            if (isActive) {
                // Если активируем кнопки
                button.active = true; // Делаем кнопку видимой
                button.scale = new Vec3(0, 0, 0); // Устанавливаем начальный scale (нулевой)
    
                const tweenButton = tween(button)
                    .delay(delay) // Задержка перед началом анимации
                    .to(0.3, { scale: new Vec3(1, 1, 1) }, { easing: 'backOut' }) // Эффект "отскока"
                    .call(() => {
                        this.currentTweenButtons.delete(button); // Удаляем из карты после завершения
                    })
                    .start();
    
                this.currentTweenButtons.set(button, tweenButton);
            } else {
                // Если деактивируем кнопки
                const tweenButton = tween(button)
                    .delay(delay) // Задержка перед началом анимации
                    .to(0.3, { scale: new Vec3(0, 0, 0) }, { easing: 'expoInOut' }) // Плавное уменьшение
                    .call(() => {
                        button.active = false; // Делаем кнопку невидимой после анимации
                        this.currentTweenButtons.delete(button); // Удаляем из карты после завершения
                    })
                    .start();
    
                this.currentTweenButtons.set(button, tweenButton);
            }
        });
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