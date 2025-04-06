import { TileType } from './TileType';

export class MapTile{
    type: TileType
    x: number
    y: number

    constructor(type: TileType, x: number, y:number){
        this.type = type;
        this.x = x;
        this.y = y;
    }
}