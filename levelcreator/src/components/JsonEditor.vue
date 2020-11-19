
<template>
  <!-- need to find a better text editor -->
  <div class="editor">
    <div class="actions">
      <div>
        {{ remainingHeight }}
      </div>  
      <div>
        <button @click="save">Update</button>
        <button @click="exportFile">Export</button>
      </div>
    </div>
    <textarea
      class="editor-area"
      :value="jsonString"
      @input="change"
    ></textarea>
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

    const exportFile = () => {
      const data = jsonString.value;
      const blob = new Blob([data], { type: "text/plain" });
      const e = document.createEvent("MouseEvents");
      const a = document.createElement("a");
      a.download = "test.json";
      a.href = window.URL.createObjectURL(blob);
      a.dataset.downloadurl = ["text/json", a.download, a.href].join(":");
      e.initEvent("click", true, false);
      a.dispatchEvent(e);
    };

    return { ...context, jsonString, change, save, exportFile };
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

.actions {
  display: flex;
  justify-content: space-between;
}
</style>