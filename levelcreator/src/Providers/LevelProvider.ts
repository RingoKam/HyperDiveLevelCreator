// src/composables/counter.js
import { Level } from '@/Interfaces/Level';
import { provide, inject, ref, reactive, computed } from 'vue';

const LEVEL_CONTEXT = Symbol();

export class LevelProvider {

  public levelJson: Level

  constructor(initialValue: Level) {
    this.levelJson = reactive<Level>(initialValue);
  }

  public setJSON(obj: Object) {
    Object.entries(obj).forEach(([key, value]) => {
      this.levelJson[key] = value;
    })
  };

  public addNewWave(height: number | null) {
    if (!height) {
      height = 20;
    }
    this.levelJson.waves.push({
      nextSpawnHeight: height,
      obstacles: {}
    })
  }

  public remainingHeight = computed(() => {
    const height = this.levelJson.waves.reduce((a, c) => {
      a += c.nextSpawnHeight;
      return a;
    }, 0);
    return `${height}/${this.levelJson.height}`
  })

  public setObstacles(level: number, obstacles: any) {
    this.levelJson.waves[level].obstacles = obstacles;
  }

  public deleteWave(level: number) {
    this.levelJson.waves.splice(level, 1);
  }
}

export function useLevelProvider(initialValue: Level) {
  const provider = new LevelProvider(initialValue);
  provide(LEVEL_CONTEXT, provider);
}

export function useLevelContext(): any {
  const context = inject<LevelProvider>(LEVEL_CONTEXT);
  if (!context) {
    throw new Error('Provider need context');
  }
  return context;
}