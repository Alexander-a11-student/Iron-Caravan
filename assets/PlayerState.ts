import { _decorator, Component, Node } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('PlayerState')
export class PlayerState extends Component {
    private parameters: Map<string, number> = new Map();

    constructor() {
        super();
        this.loadState();
    }

    addParameter(name: string, amount: number) {
        this.loadState();

        const current = this.parameters.get(name) || 0;
        this.parameters.set(name, current + amount);
        this.saveState();
    }

    subtractParameter(name: string, amount: number) {
        this.loadState();

        const current = this.parameters.get(name) || 0;
        if (current >= amount) {
            this.parameters.set(name, current - amount);
            this.saveState();
        } else {
            console.error(`Not enough ${name} to subtract.`);
        }
    }

    getParameter(name: string): number {
        this.loadState();

        return this.parameters.get(name) || 0;
    }

    private saveState() {
        const state: { [key: string]: number } = {};
        this.parameters.forEach((value, key) => {
            state[key] = value;
        });
        cc.sys.localStorage.setItem('playerState', JSON.stringify(state));
    }

    private loadState() {
        const state = JSON.parse(cc.sys.localStorage.getItem('playerState') || '{}');
        for (const key in state) {
            this.parameters.set(key, state[key]);
        }

    }
}
