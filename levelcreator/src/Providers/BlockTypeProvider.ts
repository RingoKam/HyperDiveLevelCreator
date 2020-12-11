import { provide, inject, ref, reactive, computed, Ref } from 'vue';

const BLOCKTYPE_CONTEXT = Symbol();

class BlockTypeProvider {

    public blockType: Ref<string>

    constructor(initialValue: string) {
        this.blockType = ref<string>("unbreakable");
    }

    changeBlockType(newblockType: string) {
        this.blockType.value = newblockType;
    }
}

export function useBlockTypeProvider(initialValue: string = "Unbreakable") {
    const blockTypeProvider = new BlockTypeProvider(initialValue);
    provide(BLOCKTYPE_CONTEXT, blockTypeProvider)
}

export function useBlockTypeContext() {
    const context = inject<BlockTypeProvider>(BLOCKTYPE_CONTEXT);
    if (!context) {
        throw new Error('Provider need context');
    }
    return context;
}