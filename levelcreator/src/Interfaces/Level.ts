export interface Level {
    env: string;
    height: number;
    offsetTop: number;
    offsetBottom: number;
    waves?: (WavesEntity)[] | null;
}

export interface WavesEntity {
    nextSpawnHeight: number;
    obstacles: Obstacles;
}

export interface Obstacles {
    unbreakable?: (UnbreakableEntity)[] | null;
}

export interface UnbreakableEntity {
    x: string;
    y: string;
}
