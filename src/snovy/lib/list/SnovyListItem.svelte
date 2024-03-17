<script lang="ts">

  import type {GenericItem} from "../../../util/types"
  import SnovyInput from "../input/SnovyInput.svelte"
  import {createEventDispatcher} from "svelte"
  import type {ItemPart} from "./SnovyList.svelte"

  type T = $$Generic<GenericItem>

  export let preset: "editable" | "simple" = "simple"

  export let item: T

  const dispatch = createEventDispatcher()

  // TODO why did I do this, exactly?
  // let hasBeenClicked = false

  function handleClick(e: MouseEvent) {
    // if (hasBeenClicked) return
    //
    // hasBeenClicked = true
    // setTimeout(() => {
    //   hasBeenClicked = false
    // }, 10)

    dispatch("click", e)
  }

  export let customItem: ItemPart<T> = undefined

  export let onInput: (str: string) => void

</script>

<!--note list item = pass button action + icon-->
<!--color list item = pass button action + icon-->
<!--tag list item = two color list items-->
<!--search/favorites list item = pass string representation method (section | note) + pass button action + icon-->

<li {...$$restProps} class="snovy-list-item styled-hover-fill {$$restProps.class || ''}" tabIndex={-1}>
  <div on:click={handleClick} on:contextmenu|stopPropagation>
    {#if customItem}
      <svelte:component this={customItem.part} {...customItem.props} item={item}></svelte:component>
    {:else if preset === "editable"}
      <SnovyInput placeholder="Title" mode="managed" on:input={e => onInput(e.target.value)} value={item.toString()}/>
    {:else if preset === "simple"}
      <div class="li-simple-content" tabIndex={0}>{item.toString()}</div>
    {/if}
  </div>

  <slot name="list-item-button"></slot>
</li>

<style lang="scss">
  .snovy-list-item {
    //width: 100%;
    max-width: 100%;
    min-width: 0;
    //TODO typical flex shenanigans

    padding: 0.1em 0.2em;
    scroll-snap-align: start;
    border-radius: unset;
    display: flex;
    flex-flow: row nowrap;
    align-items: center;
    justify-content: space-between;

    :global(.snovy-input) {
      --border-width: 0;

      padding: unset;
      text-indent: unset;
    }

    & > :first-child {
      outline: none !important;
    }
  }

  .li-simple-content {
  }

</style>
