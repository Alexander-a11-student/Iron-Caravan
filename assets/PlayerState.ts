import { _decorator, Component } from 'cc';
const { ccclass } = _decorator;

@ccclass('PlayerState')
export class PlayerState extends Component {
    private parameters: Map<string, number> = new Map();

    constructor() {
        super();
        // Removed loading state from local storage
    }

    addParameter(name: string, amount: number) {
        const current = this.parameters.get(name) || 0;
        this.parameters.set(name, current + amount);
        // Removed saving state to local storage
    }

    subtractParameter(name: string, amount: number) {
        const current = this.parameters.get(name) || 0;
        if (current >= amount) {
            this.parameters.set(name, current - amount);
            // Removed saving state to local storage
        } else {
            console.error(`Not enough ${name} to subtract.`);
        }
    }

    getParameter(name: string): number {
        return this.parameters.get(name) || 0;
    }
}
