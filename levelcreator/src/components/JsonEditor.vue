
<template>
  <!-- need to find a better text editor -->
  <div class="editor">
    <div class="actions">
      <button @click="save">Update</button>
    </div>
    <textarea class="editor-area" :value="jsonString" @input="change"></textarea>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed, ref, watch } from "vue";
import { debounce } from "lodash";

import { useLevelContext } from "../Providers/LevelProvider";

export default defineComponent({
  setup() {
    const context: any = useLevelContext();
    let jsonString = ref<string>(JSON.stringify(context["levelJson"], null, 4));
    watch(context["levelJson"], () => {
      jsonString.value = JSON.stringify(context["levelJson"], null, 4);
    });

    const change = (event: any) => {
      jsonString.value = event.target.value;
    };

    const save = () => {
      try {
        const json = JSON.parse(jsonString.value);
        context.setJSON(json);
      } catch (error) {
        window.alert("invalid json");
        console.error(error);
      }
    };

    return { ...context, jsonString, change, save };
  },
});
</script>

<style>
.editor {
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: column;
}

.editor-area {
  flex: 1 1 100%;
}

</style>