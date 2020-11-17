<template>
  <div class="content">
    <div class="content-section">
      <JsonEditor />
    </div>
    <div class="content-section">
      <LevelCreator />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import LevelCreator from "./components/LevelCreator.vue";
import JsonEditor from "./components/JsonEditor.vue";

export default defineComponent({
  name: "App",
  components: {
    LevelCreator,
    JsonEditor
  },
});
</script>

<style>
  .content {
    width: 100vw;
    height: 100vh;
    display: flex;
    justify-content: space-evenly;
    align-items: stretch;
    align-content: stretch;
  }

  .content-section {
    width: 100%;
    height: 100%;
  }
</style>
