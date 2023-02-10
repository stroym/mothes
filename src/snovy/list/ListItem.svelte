<script lang="ts">

  import type {GenericItem} from "../../util/types"
  import type {CustomizableChild} from "../snovy-types"

  type T = $$Generic<GenericItem>

  export let preset: "editable" | "simple" = "simple"

  export let item: T

  export let custom: CustomizableChild

  export let onValueChange: (str: string) => void

</script>

<!--note list item = pass button action + icon-->
<!--color list item = pass button action + icon-->
<!--tag list item = two color list items-->
<!--search/favorites list item = pass string representation method (section | note) + pass button action + icon-->

<li {...$$restProps} class={`snovy-list-item styled-hover-fill ${$$restProps.class || ""}`} on:click on:contextmenu>
  {#if custom?.component}
    <svelte:component this={custom.component} {...custom.props} item={item}></svelte:component>
  {:else if preset === "editable"}
    <!--    <EditableInput placeholder="Title" onValueChange={onValueChange} value={item.toString()}/>-->
  {:else if preset === "simple"}
    <div class="li-simple-content" tabIndex={0}>{item.toString()}</div>
  {/if}

  {#if custom?.button}
    <!--TODO icon button that accepts icon and action-->
    <button> on:click={custom?.button.action}</button>
  {/if}

  <slot name="remove-button"></slot>

</li>

<style lang="scss">
  .snovy-list-item {
    width: 100%;
    padding: 0.1em;
    scroll-snap-align: start;
    border-radius: unset;
    display: flex;
    flex-flow: row nowrap;
    align-items: center;
    justify-content: flex-start;

    &, & > * {
      cursor: default;
      user-select: none;
    }

    & > :first-child {
      outline: none !important;
    }
  }

  .li-simple-content {
  }

</style>
