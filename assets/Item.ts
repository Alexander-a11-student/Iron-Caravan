import { _decorator, Component, Node } from 'cc';
const { ccclass, property } = _decorator;

export enum ItemType {
    TYPE1,
    TYPE2,
    TYPE3,
}

export enum ItemRarity {
    COMMON,
    UNCOMMON,
    RARE,
}

@ccclass('Item')
export class Item extends Component {
    type: ItemType = ItemType.TYPE1;
    itemName: string;
    spriteLink: string;
    quantity: number;
    rarity: ItemRarity = ItemRarity.COMMON;

    constructor(type: ItemType, itemName: string, spriteLink: string, quantity: number, rarity: ItemRarity) {
        super();
        this.type = type;
        this.spriteLink = spriteLink;
        this.quantity = quantity;
        this.rarity = rarity;
    }
}
