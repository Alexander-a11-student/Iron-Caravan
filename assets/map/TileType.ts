export enum TileType{
    GRASS = 0,
    SNOW = 1,
    SAND = 2,
    MUD = 3
}

export class TileCoords{
    x: number = 0;
    y: number = 0;

    constructor(x: number, y: number){
        this.x = x;
        this.y = y;
    }
}