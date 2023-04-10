<script lang="ts">

  import type {GenericItem} from "../../util/types"
  import type {CustomizableChild} from "../snovy-types"
  import SnovyInput from "../input/SnovyInput.svelte"
  import SnovyButton from "../input/SnovyButton.svelte";

  type T = $$Generic<GenericItem>

  export let preset: "editable" | "simple" = "simple"

  export let item: T

  export let custom: CustomizableChild

  export let onInput: (str: string) => void

</script>

<!--note list item = pass button action + icon-->
<!--color list item = pass button action + icon-->
<!--tag list item = two color list items-->
<!--search/favorites list item = pass string representation method (section | note) + pass button action + icon-->

<li {...$$restProps} class={`snovy-list-item styled-hover-fill ${$$restProps.class || ""}`} on:click on:contextmenu>
  {#if custom?.component}
    <svelte:component this={custom.component} {...custom.props} item={item}></svelte:component>
  {:else if preset === "editable"}
    <SnovyInput placeholder="Title" mode="managed" on:input={e => onInput(e.target.value)} value={item.toString()}/>
  {:else if preset === "simple"}
    <div class="li-simple-content" tabIndex={0}>{item.toString()}</div>
  {/if}

  {#if custom?.button}
    <SnovyButton on:click={custom.button.action} icon={custom.button.icon} circular/>
  {/if}

  <slot name="remove-button"></slot>

</li>

<style lang="scss">
  .snovy-list-item {
    //width: 100%;
    max-width: 100%;
    min-width: 0;
    //TODO typical flex shenanigans

    font-size: var(--font-medium);
    padding: 0.1em 0.2em;
    scroll-snap-align: start;
    border-radius: unset;
    display: flex;
    flex-flow: row nowrap;
    align-items: center;
    justify-content: space-between;

    & :global(.snovy-input) {
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
