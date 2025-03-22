import { _decorator, Component, director, Node } from 'cc'; // Importing Node
import { PlayerState } from './PlayerState';
import { ResourceManager } from './ResourceManager';
import { ItemManager } from './ItemManager';

const { ccclass } = _decorator;

@ccclass('PersistComponentsManager')
export class PersistComponentsManager extends Component {
    private playerStateNode: Node;
    private resourceManagerNode: Node;
    private itemManagerNode: Node;

    constructor() {
        super();
        
        // Create nodes for PlayerState and ResourceManager
        this.playerStateNode = new Node('PlayerStateNode');
        this.resourceManagerNode = new Node('ResourceManagerNode');
        this.itemManagerNode = new Node('ItemManagerNode');

        // Add components to the nodes
        this.playerStateNode.addComponent(PlayerState);
        this.resourceManagerNode.addComponent(ResourceManager);
        this.itemManagerNode.addComponent(ItemManager);

        // Add nodes to the director
        director.addPersistRootNode(this.playerStateNode);
        director.addPersistRootNode(this.resourceManagerNode);
        director.addPersistRootNode(this.itemManagerNode);
    }
}
