
<template>
  <!-- need to find a better text editor -->
  <textarea class="editor" :value="jsonString" @input="change"></textarea>
</template>

<script lang="ts">
import { defineComponent, computed } from "vue";
import { debounce } from "lodash";

import { useLevelContext } from "../Providers/LevelProvider";

export default defineComponent({
  setup() {
    const context : any = useLevelContext();
    const jsonString = computed(() => {
      return JSON.stringify(context["levelJson"], null, 4);
    });
    const change = (event: any) => {
      const jsonString = event.target.value;
      try {
        debounce(() => {
          const json = JSON.parse(jsonString);
          context.setJSON(json);
        }, 2000)() //wait for 2 second
      } catch (error) {
        console.error(error);
      }
    }
    return { ...context, jsonString, change };
  }
});
</script>

<style>
.editor {
  height: 100%;
  width: 100%;
}
</style>