<script lang="ts">

  import type {KeyMapping} from "../../../util/utils"
  import {Key} from "ts-key-enum"
  import {watchOutsideClick} from "../../../util/svelte-hooks"
  import {useKey} from "../../../util/utils"
  import {beforeUpdate, createEventDispatcher} from "svelte"

  const dispatch = createEventDispatcher()
  let self: HTMLInputElement = null

  export let mode: "simple" | "managed" | "color" = "simple"
  export let value = ""

  const [editable, toggle] = watchOutsideClick(self, {watch: mode === "managed"})
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
    {...$$restProps} class={`snovy-input snovy-input-color styled-focus ${$$restProps.class || ""}`} autoComplete="off"
    type="color" readonly={!$editable}
    bind:value
    on:input on:change
  />
{:else}
  <input
    {...$$restProps} class={`snovy-input styled-focus ${$$restProps.class || ""}`} autoComplete="off"
    type="text" readonly={!$editable}
    bind:this={self} bind:value
    on:input on:change on:focus={e => setTimeout(() => self?.setSelectionRange(-1, -1), 1) && dispatch("focus", e)}
    on:dblclick={e => mode === "managed" && toggle()}
    on:keydown={e => useKey(e, keyMap)}
  />
{/if}

<style lang="scss">
  .snovy-input {
    --border-width: var(--border-thin);
    --border-rad: var(--rad-rounded);

    font-size: var(--font-medium);
    background-color: transparent;
    border-radius: var(--border-rad);
    outline: none;
    padding: 0.05em;
    text-indent: 0.2em;
    width: 100%;
    max-width: 100%;
    min-width: 0;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    color: inherit;

    &.snovy-input-color {
      cursor: pointer;
      padding: unset;

      &::-moz-color-swatch {
        border: unset;
        border-radius: unset;
        padding: unset;
      }

      &::-webkit-color-swatch {
        border: unset;
        border-radius: unset;
      }

      &::-webkit-color-swatch-wrapper {
        padding: unset;
      }
    }

    &[readonly] {
      cursor: default;
    }
  }
</style>
