<script lang="ts">

  import type {KeyMapping} from "../../util/utils"
  import {Key} from "ts-key-enum"
  import {watchOutsideClick} from "../../util/svelte-hooks"
  import {useKey} from "../../util/utils.js"
  import {beforeUpdate} from "svelte"

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
      if (self && editable) {
        self.setSelectionRange(-1, -1)
      }
    }
  )
</script>

{#if mode === "color"}
{:else}
  <input
    {...$$restProps} class={`snovy-input styled-focus ${$$restProps.class || ""}`} autoComplete="off"
    type="text" readonly={!$editable} data-editable={$editable}
    bind:this={self} bind:value
    on:input on:change on:focus={e => {self.selectionStart = self.selectionEnd = -1}}
    on:dblclick={e => mode === "managed" && toggle()}
    on:keydown={e => useKey(e, keyMap)}
  />
{/if}

<style lang="scss">
  .snovy-input {
    --border-width: var(--border-thin);

    background-color: transparent;
    border: none;
    border-radius: var(--border-rad);
    outline: none;
    padding: 0.1vh;
    text-indent: 0.2vw;
    width: 100%;
    overflow: hidden;
    text-overflow: ellipsis;
    min-width: 0;
    color: inherit;

    &[readonly] {
      cursor: default;
    }
  }
</style>
