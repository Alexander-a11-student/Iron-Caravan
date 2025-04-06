import { _decorator, Component, director, instantiate, Node, Prefab, SpriteFrame } from 'cc';
import { TileCoords, TileType } from './TileType';
import { MapTile } from './MapTile';
const { ccclass, property } = _decorator;

@ccclass('MapManager')
export class MapManager extends Component{

    @property(Prefab)
    grass: Prefab

    @property(Prefab)
    sand: Prefab
    
    @property(Prefab)
    snow: Prefab

    @property(Prefab)
    mud: Prefab

    private _map: Array<MapTile> = Array()

    start(){
        this.generateSquareGrassMap(20)
        this.createBiomeCenter(4, 4, TileType.SAND, 3)
        this.createBiomeCenter(-4, -4, TileType.SNOW, 3)
        this.createBiomeCenter(-5, 4, TileType.MUD, 3)
        this.createTilesOnCanvas()
    }

    generateSquareGrassMap(size: number){
        for (let x = -10; x < size - 10; x++) {
            for (let y = -10; y < size - 10; y++) {
                this._map.push(new MapTile(TileType.GRASS, x, y))
            }
          }
    }

    createTilesOnCanvas(){
        let canvas = director.getScene().getChildByName("Canvas");
        
        this._map.forEach((value: MapTile) => {
            let tile: Node
            switch(value.type) {
                case TileType.GRASS:
                    tile = instantiate(this.grass);
                    break
                case TileType.SAND:
                    tile = instantiate(this.sand);
                    break
                case TileType.SNOW:
                    tile = instantiate(this.snow);
                    break
                case TileType.MUD:
                    tile = instantiate(this.mud);
                    break
            }
            tile.setParent(canvas)
            tile.setPosition(64*value.x, 64*value.y)
            tile.setSiblingIndex(3)
        });
    }

    createBiomeCenter(centerX: number, centerY: number, type: TileType, size: number){
        this._map.forEach((value: MapTile) => {
            if (((value.x) > centerX - size) && ((value.x) < centerX + size) && ((value.y) > centerY - size) && ((value.y) < centerY + size)){
                value.type = type
            }
    })
    }
}