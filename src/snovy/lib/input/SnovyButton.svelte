<script lang="ts" context="module">

  export type Presets = "provided" | "remove" | "add" | "collapse" | "check" | "source"

</script>

<script lang="ts">

  import SnovyIcon from "../helper/SnovyIcon.svelte"
  import type {SnovyIconOption} from "../snovy-types"

  let self: HTMLButtonElement = null

  export let icon: SnovyIconOption

  export let circular: boolean = false
  export let border: boolean = false
  export let fill: boolean = false
  export let color: string = ""

</script>

<button
  {...$$restProps} class={`snovy-button ${fill ? 'styled-hover-fill' : 'styled-hover'} ${$$restProps.class || ""}`}
  class:icon class:circular class:border class:color={$$props.style?.backgroundColor}
  bind:this={self}
  on:click
>
  {#if icon}
    <SnovyIcon circular={circular} name={icon}/>
  {:else}
    {$$props.value || $$props.defaultValue}
  {/if}
</button>

<style lang="scss">
  .snovy-button {
    --border-width: var(--border-thin);
    --button-border-rad: var(--rad-rounded);

    font-size: var(--font-medium);
    color: inherit;
    background-color: transparent;
    border-radius: var(--button-border-rad);
    outline: none;
    cursor: pointer;
    padding: 0.25em;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;

    &:is(.circular, .icon) {
      padding: unset;
      margin: unset;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
    }

    &.circular {
      --button-border-rad: 50%;
      border-radius: var(--rad-rounded);
    }

    &.icon {
      --border-width: 0;
      font-size: var(--font-medium);
    }
  }
</style>
