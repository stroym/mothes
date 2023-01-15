<script lang="ts">
  import Icon from "../helper/Icon.svelte"

  export let id: string
  export let title: string = null
  export let icon: string = null
</script>

<div {...$$restProps} title={icon && title} on:click on:keypress type="button" tabIndex={0}
     class="snovy-tab-menu-item styled-hover-fill {$$restProps.class || ''} {icon ? 'icon' : ''}">
  {#if icon}
    <Icon name="{icon}"></Icon>
  {:else}
    {title ?? id}
  {/if}
</div>

<style lang="scss">
  .snovy-tab-menu-item {
    --border-rad: 0;

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
    //aspect-ratio: 1 / 1;

    &.icon {
      display: grid;
      place-content: center;
    }
  }

  :global svg {
    height: 2em;
    width: 2em;
  }
</style>
