<template>
    <canvas ref="canvas"></canvas>
</template>

<script lang="ts">
import { ref, computed, onMounted } from "vue";
import createScene from "../Scenes//LevelCreator"

export default {
    setup() {
        const canvas = ref(null);
        onMounted(() => {
            createScene(canvas.value); // this is your $el
        }) 
        return {
            canvas
        }
    }
}
</script>

<style>
    canvas {
        width: 100%;
        height: 100%;
    }
</style>