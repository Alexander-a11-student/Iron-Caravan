import { _decorator, Component } from 'cc';
import { Item } from './Item'; // Import the Item class
const { ccclass, property } = _decorator;

@ccclass('ItemManager')
export class ItemManager extends Component {
    private items: Map<string, Item> = new Map(); // Initialize the map with items


    start() {
        // Initialization logic if needed
    }

    addItemQuantity(item: Item, quantity: number) {
        const existingItem = this.items.get(item.itemName);
        if (existingItem) {
            existingItem.quantity += quantity;

        }
    }

    subtractItemQuantity(itemsToSubtract: Item[]): boolean {
        for (const item of itemsToSubtract) {
            const existingItem = this.items.get(item.itemName);
            if (!existingItem || existingItem.quantity < item.quantity) {
                return false; // Not enough quantity for at least one item
            }
        }


        for (const item of itemsToSubtract) {
            const existingItem = this.items.get(item.itemName);
            existingItem.quantity -= item.quantity;
        }
        return true;
    }

    getItem(itemName: string): Item | undefined {
        return this.items.get(itemName);
    }
}
