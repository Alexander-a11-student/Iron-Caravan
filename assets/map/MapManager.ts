import { _decorator, Component, director, instantiate, Node, Prefab, SpriteFrame, math } from 'cc';
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
        this.generateSquareGrassMap(100)
        this.createRandomBiomeCenter(44, 24, TileType.SAND, math.randomRangeInt(10, 20.2))
        this.createRandomBiomeCenter(-34, -4, TileType.SNOW, math.randomRangeInt(10, 20))
        this.createRandomBiomeCenter(-15, 24, TileType.MUD, math.randomRangeInt(10, 20))
        this.createRandomBiomeCenter(-5, 4, TileType.MUD, math.randomRangeInt(8, 15))
        this.createTilesOnCanvas()
    }

    generateSquareGrassMap(size: number) {
        for (let x = -size/2; x < size/2; x++) {
            for (let y = -size / 2; y < size / 2; y++) {
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

    createRandomBiomeCenter(centerX: number, centerY: number, type: TileType, size: number) {
        let fork = math.randomRangeInt(0.5, 2.5)
        switch (fork) {
            case 1:
                this.createRoundBiomeCenter(centerX, centerY, type, size);
                break
            case 2:
                this.createSquareBiomeCenter(centerX, centerY, type, size);
                break

        }
    }

    createRoundBiomeCenter(centerX: number, centerY: number, type: TileType, size: number){
        this._map.forEach((value: MapTile) => {
            if (Math.pow(value.x - centerX, 2) + Math.pow(value.y - centerY, 2) < Math.pow(size, 2)) {
                value.type = type
            }
    })
    }
    createSquareBiomeCenter(centerX: number, centerY: number, type: TileType, size: number) {
        this._map.forEach((value: MapTile) => {
            if (Math.pow(value.x - centerX, 2) + Math.pow(value.y - centerY, 2) < Math.pow(size, 2)) {
                value.type = type
            }
        })
    }
}