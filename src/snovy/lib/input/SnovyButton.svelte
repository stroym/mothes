<script lang="ts" context="module">

  export type Presets = "provided" | "remove" | "add" | "collapse" | "check" | "source"

</script>

<script lang="ts">

  import SnovyIcon from "../helper/SnovyIcon.svelte"
  import type {SnovyIconOption} from "../helper/SnovyIcon.svelte"

  let self: HTMLButtonElement = null

  export let disabled: boolean = false

  export let icon: SnovyIconOption = null

  export let circular: boolean = false
  export let border: boolean = true
  export let fill: boolean = true
  export let color: string = ""

</script>

<button
  {...$$restProps} type="button" class="snovy-button {fill ? 'styled-hover-fill' : 'styled-hover'} {$$restProps.class || ''}"
  class:icon class:circular class:border class:color={$$props.style?.backgroundColor}
  bind:this={self} disabled={disabled}
  on:click
>
  {#if icon}
    <SnovyIcon circular={circular} name={icon}/>
  {:else}
    {$$props.value || $$props.defaultValue}
  {/if}
</button>

<style lang="scss">
  //share core style with .snovy-toggle
  :global .snovy-button {
    --border-width: var(--border-thin);
    --border-rad: var(--rad-rounded);

    font-size: var(--font-medium);
    color: inherit;
    background-color: transparent;
    border-radius: var(--border-rad);
    outline: none;
    cursor: pointer;

    &.circular {
      --border-rad: 50%;
    }

    &.icon {
      --border-width: 0;
    }
  }

  .snovy-button {
    padding: 0.25em;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;

    &:is(.circular, .icon) {
      padding: unset;
      margin: unset;
      overflow: unset;
    }
  }
</style>
