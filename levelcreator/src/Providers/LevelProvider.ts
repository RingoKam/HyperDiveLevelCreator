// src/composables/counter.js
import { provide, inject, ref, reactive, computed } from 'vue';

const COUNTER_CONTEXT = Symbol();

export function useLevelProvider(initialValue : Object ) {

  let levelJson = reactive<any>(initialValue);
  let blockType = ref<string>("unbreakable");
  
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

  const remainingHeight = computed(() => {
    const height = levelJson.waves.reduce((a,c) => {
      a += c.nextSpawnHeight;
      return a; 
    }, 0);
    return `${height}/${levelJson.height}`
  })

  const setObstacles = (level: number, obstacles: any) => {
      levelJson.waves[level].obstacles = obstacles;  
  }

  const deleteWave = (level: number) => {
    levelJson.waves.splice(level, 1);
  }

  const changeBlockType = (newblockType: string) => {
    blockType.value = newblockType;
  }

  provide(COUNTER_CONTEXT, {
    blockType,
    changeBlockType,
    levelJson,
    setJSON,
    addNewWave,
    setObstacles,
    deleteWave,
    remainingHeight
  });
}

export function useLevelContext() : any {
  const context = inject<Object>(COUNTER_CONTEXT);
  if (!context) {
    throw new Error('Provider need context');
  }
  return context;
}