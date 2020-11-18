// src/composables/counter.js
import { provide, inject, ref, reactive } from 'vue';

const COUNTER_CONTEXT = Symbol();

export function useLevelProvider(initialValue : Object ) {
  let levelJson = reactive<any>(initialValue);
  
  const setJSON = (obj : Object) => {
      Object.entries(obj).forEach(([key, value]) => {
          levelJson[key] = value;
      })
  };

  function addNewWave (height: number | null) {
      if(!height) {
          height = 20;
      }
      levelJson["waves"].push({
        nextSpawnHeight: height, 
        obstacles: []
      })
  }

  const setObstacles = (level: number, obstacles: any) => {
      levelJson.waves[level].obstacles = obstacles;  
  }

  const deleteWave = (level: number) => {
    levelJson.waves.splice(level, 1);
  }

  provide(COUNTER_CONTEXT, {
    levelJson,
    setJSON,
    addNewWave,
    setObstacles,
    deleteWave
  });
}

export function useLevelContext() : any {
  const context = inject<Object>(COUNTER_CONTEXT);
  if (!context) {
    throw new Error('Provider need context');
  }
  return context;
}