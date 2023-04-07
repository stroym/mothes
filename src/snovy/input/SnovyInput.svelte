<script lang="ts">

  import type {KeyMapping} from "../../util/utils"
  import {Key} from "ts-key-enum"
  import {watchOutsideClick} from "../../util/svelte-hooks"
  import {useKey} from "../../util/utils.js"
  import {beforeUpdate, createEventDispatcher} from "svelte"

  const dispatch = createEventDispatcher()
  let self: HTMLInputElement = null

  export let mode: "simple" | "managed" | "color" = "simple"
  export let value = ""

  const [editable, toggle] = watchOutsideClick(self, {initialState: mode !== "managed"})
  const keyMap: Array<KeyMapping> = []

  if (mode === "managed") {
    keyMap.push({key: Key.Enter, handler: () => toggle(), modifiers: {shift: true}})
  } else if (mode === "color") {
    keyMap.push(
      // {key: Key.Enter, handler: getColor},
      // {key: Key.Backspace, handler: () => setColor(defaultColor), condition: color.replaceAll("#", "").length == 0}
    )
  }

  beforeUpdate(
    () => {
      if (editable) {
        self?.setSelectionRange(-1, -1)
      } else {
        self?.setSelectionRange(0, 0)
      }
    }
  )
</script>

{#if mode === "color"}
  <input
    {...$$restProps} class={`snovy-input styled-focus ${$$restProps.class || ""}`} autoComplete="off"
    type="color"
  />
{:else}
  <input
    {...$$restProps} class={`snovy-input styled-focus ${$$restProps.class || ""}`} autoComplete="off"
    type="text" readonly={!$editable} data-editable={$editable}
    bind:this={self} bind:value
    on:input on:change on:focus={e => setTimeout(() => self?.setSelectionRange(-1, -1), 1) && dispatch("focus", e)}
    on:dblclick={e => mode === "managed" && toggle()}
    on:keydown={e => useKey(e, keyMap)}
  />
{/if}

<style lang="scss">
  .snovy-input {
    --border-width: var(--border-thin);

    font-size: var(--font-medium);
    background-color: transparent;
    border-radius: var(--border-rad);
    outline: none;
    padding: 0.1vh;
    text-indent: 0.2vh; //TODO calc based on font size
    width: 100%;
    max-width: 100%;
    min-width: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    color: inherit;

    &[readonly] {
      cursor: default;
    }
  }
</style>
