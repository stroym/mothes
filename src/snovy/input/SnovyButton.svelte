<script lang="ts">

  import SnovyIcon from "../helper/Icon.svelte"
  import type {SnovyIconOption} from "../snovy-types"


  export type Presets = "provided" | "remove" | "add" | "collapse" | "check" | "source"

  let self: HTMLButtonElement = null

  export let icon: SnovyIconOption

  export let circular: boolean = false
  export let fill: boolean = false
  export let color: string = ""

</script>

<button
  {...$$restProps} class={`snovy-button ${fill ? 'styled-hover-fill' : 'styled-hover'} ${$$restProps.class || ""}`}
  class:icon class:circular class:color={$$props.style?.backgroundColor}
  bind:this={self}
  on:click
>
  {#if icon}
    <SnovyIcon name={icon}/>
  {:else}
    {$$props.value || $$props.defaultValue}
  {/if}
</button>

<style lang="scss">
  .snovy-button {
    --border-width: var(--border-thin);

    font-size: var(--font-medium);
    color: inherit;
    background-color: transparent;
    border: none;
    border-radius: var(--border-rad);
    outline: none;

    &.icon {
      font-size: var(--font-medium);
    }

    &.circular {
      height: var(--font-medium);
      width: var(--font-medium);
      border-radius: 50%;
      display: grid;
    }

  }
</style>
