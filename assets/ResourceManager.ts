import { _decorator, Component } from 'cc';
import { Resource } from './Resource'; // Importing the Resource class
const { ccclass } = _decorator;

@ccclass('ResourceManager')
export class ResourceManager extends Component {
    private static instance: ResourceManager;
    private resources: Map<string, Resource>;

    public static getInstance(): ResourceManager {
        if (!ResourceManager.instance) {
            ResourceManager.instance = new ResourceManager();
        }
        return ResourceManager.instance;
    }

    constructor() {
        super();
        this.resources = new Map<string, Resource>([
            ['brass', new Resource('Brass')],
            ['iron', new Resource('Iron')],
            ['steel', new Resource('Steel')],
            ['wood', new Resource('Wood')],
            ['energy', new Resource('Energy')],
            ['stone', new Resource('Stone')]
        ]);
    }

    addResource(resourceName: string, amount: number) {
        const resource = this.resources.get(resourceName);
        if (resource) {
            resource.add(amount);
        } else {
            console.error(`Resource ${resourceName} not found.`);
        }
    }

    subtractResources(resources: { resourceName: string, amount: number }[]): boolean {
        let canSubtract = true;

        for (const { resourceName, amount } of resources) {
            const resource = this.resources.get(resourceName);
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

        if (canSubtract) {
            for (const { resourceName, amount } of resources) {
                const resource = this.resources.get(resourceName);
                if (resource) {
                    resource.subtract(amount);
                }
            }
            return true;
        }

        return false;
    }

    getResourceAmount(resourceName: string): number {
        const resource = this.resources.get(resourceName);
        return resource ? resource.quantity : 0;
    }
}
