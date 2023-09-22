<script lang="ts">
  import SnovyIcon from "../helper/SnovyIcon.svelte"
  import type {SnovyIconOption} from "../snovy-types";

  export let id: string
  export let title: string = null
  export let icon: SnovyIconOption = null
</script>

<div {...$$restProps} title={icon && title} on:click on:keypress type="button" tabIndex={0}
     class={`snovy-tab-menu-item styled-hover-fill ${$$restProps.class || ""}`} class:icon>
  {#if icon}
    <SnovyIcon wrap name="{icon}"></SnovyIcon>
  {:else}
    {title ?? id}
  {/if}
</div>

<style lang="scss">
  .snovy-tab-menu-item {
    --border-rad: 0;

    max-height: 100%;
    max-width: 100%;
    flex: 1 1 100%;
    border: none;
    outline: none;
    //background-color: transparent;
    color: inherit;
    cursor: default;
    user-select: none;
    overflow: hidden;
    text-align: center;
    text-overflow: ellipsis;
    white-space: nowrap;

    &.icon {
      font-size: var(--font-medium);
    }
  }
</style>
