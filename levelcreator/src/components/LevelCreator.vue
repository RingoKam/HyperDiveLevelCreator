<template>
    <div class="level-creator">
        <div class="level-creator-header">
            <button @click="newWave">+ Wave</button>
        </div>
        <div class="level-creator-footer">
            <!-- <div>
                <label>Level</label>
                <input /> 
            </div> -->
            <label>Block Type: </label>
            <select>
                <option value="unbreakableBlock">Unbreakable</option>
            </select>
        </div>
        <canvas ref="canvas"></canvas>
    </div>
</template>

<script lang="ts">
import { ref, computed, onMounted, watch } from "vue";
import { useLevelContext } from "../Providers/LevelProvider"
import createScene from "../Scenes//LevelCreator"

export default {
    setup() {
        const canvas = ref(null);
        let isMounted = ref(false);
        const context = useLevelContext();

        onMounted(() => {
            isMounted.value = true;
            createScene(canvas.value, context); // this is your $el
        });

        const newWave = () => {
            context.addNewWave();
        } 

        const levelJson = context["levelJson"];
        watch(levelJson, () => {
            if(isMounted.value) {
                console.log("re rendering");
                createScene(canvas.value, context);
            }
        })

        return {
            canvas,
            newWave,
            ...context
        }
    }
}
</script>

<style>
    canvas {
        width: 100%;
        height: 100%;
    }

    .level-creator {
        width: 100%;
        height: 100%;
    }
    
    .level-creator-header {
        position: absolute;
        display: flex;
        width: 50%;
        padding: 5px 15px;
    }

    .level-creator-footer {
        position: absolute;
        display: flex;
        justify-content: center;
        bottom: 0px;
        width: 50%;
        padding: 5px 15px;
    }

    label {
        color: white;
    }
</style>