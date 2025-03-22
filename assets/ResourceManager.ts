import { _decorator, Component } from 'cc';
import { Resource } from './Resource'; // Importing the Resource class
const { ccclass, property } = _decorator;

@ccclass('ResourceManager')
export class ResourceManager extends Component {
    private static instance: ResourceManager;

    public static getInstance(): ResourceManager {
        if (!ResourceManager.instance) {
            ResourceManager.instance = new ResourceManager();
        }
        return ResourceManager.instance;
    }

    constructor() {
        super();
        this.loadResources();
    }

    brass: Resource = new Resource('Brass');
    iron: Resource = new Resource('Iron');
    steel: Resource = new Resource('Steel');
    wood: Resource = new Resource('Wood');
    energy: Resource = new Resource('Energy');
    stone: Resource = new Resource('Stone');

    private saveResources() {
        const resources = {
            brass: this.brass.quantity,
            iron: this.iron.quantity,
            steel: this.steel.quantity,
            wood: this.wood.quantity,
            energy: this.energy.quantity,
            stone: this.stone.quantity,
        };
        cc.sys.localStorage.setItem('resources', JSON.stringify(resources));
    }

    private loadResources() {
        const resources = JSON.parse(cc.sys.localStorage.getItem('resources') || '{}');
        this.brass.quantity = resources.brass || 0;
        this.iron.quantity = resources.iron || 0;
        this.steel.quantity = resources.steel || 0;
        this.wood.quantity = resources.wood || 0;
        this.energy.quantity = resources.energy || 0;
        this.stone.quantity = resources.stone || 0;
    }

    addResource(resourceName: string, amount: number) {
        this.loadResources(); // Load resources before adding
        const resource = this[resourceName];
        if (resource) {
            resource.add(amount);
            this.saveResources();
        } else {
            console.error(`Resource ${resourceName} not found.`);
        }
    }

    subtractResources(resources: { resourceName: string, amount: number }[]): boolean {
        // Load the latest resource quantities from local storage
        this.loadResources();

        let canSubtract = true;

        // Check if all resources can be subtracted without going negative
        for (const { resourceName, amount } of resources) {
            const resource = this[resourceName];
            if (resource) {
                if (resource.quantity < amount) {
                    console.error(`Not enough ${resourceName} to subtract.`);
                    canSubtract = false;
                    break;
                }
            } else {
                console.error(`Resource ${resourceName} not found.`);
                canSubtract = false;
                break;
            }
        }

        // If all checks passed, perform the subtraction
        if (canSubtract) {
            for (const { resourceName, amount } of resources) {
                const resource = this[resourceName];
                if (resource) {
                    resource.subtract(amount);
                }
            }
            this.saveResources();
            return true; // Indicate success
        }

        return false; // Indicate failure
    }

    getResourceAmount(resourceName: string): number {
        this.loadResources(); // Load resources before getting amount
        const resource = this[resourceName];
        return resource ? resource.quantity : 0;
    }
}
