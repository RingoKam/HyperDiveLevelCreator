
<template>
    <vueJsonEditor class="editor"/>
</template>

<script lang="ts">
import { defineComponent } from "vue";
// @ts-ignore
import vueJsonEditor from 'vue-json-editor'

export default defineComponent({
  components: {
    vueJsonEditor
  },
});
</script>

<style>
    .editor {
        height: 100%;
    }
</style>