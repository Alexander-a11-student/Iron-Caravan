import { _decorator, SpriteFrame } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('Resource')
export class Resource {
    @property
    private _name: string = '';
    private _quantity: number = 0;
    private _icon: SpriteFrame | null = null; // Ссылка на изображение ресурса

    constructor(name: string, quantity: number = 0, icon: SpriteFrame | null = null) {
        this._name = name;
        this._quantity = quantity;
        this._icon = icon;
    }

    public get name(): string {
        return this._name;
    }

    public set name(value: string) {
        this._name = value;
    }

    public get quantity(): number {
        return this._quantity;
    }

    public set quantity(value: number) {
        this._quantity = Math.max(0, value); // Защита от отрицательных значений
    }

    public get icon(): SpriteFrame | null {
        return this._icon;
    }

    public set icon(value: SpriteFrame | null) {
        this._icon = value;
    }

    public add(amount: number): void {
        this._quantity += amount;
    }

    public subtract(amount: number): void {
        this._quantity = Math.max(0, this._quantity - amount);
    }

    public set(amount: number): void {
        this._quantity = Math.max(0, amount);
        }
}
