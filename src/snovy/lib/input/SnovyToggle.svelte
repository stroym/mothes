<script lang="ts">

  import type {SnovyIconOption} from "../helper/SnovyIcon.svelte"
  import type {Toggleable} from "../../../data/model/Base";
  import SnovyIcon from "../helper/SnovyIcon.svelte";

  export let border: boolean = true

  export let target: Toggleable = undefined
  export let icons: Array<SnovyIconOption>

  export let value: boolean

  $: {
    value = target?.snvToggled() ?? value
  }
</script>

<label class="snovy-toggle snovy-button styled-hover-fill icon circular"
       class:border class:color={$$props.style?.backgroundColor}
       tabindex="0"
>
  {#if value}
    <SnovyIcon circular name={icons.at(0)}/>
  {:else}
    <SnovyIcon circular name={icons.at(-1)}/>
  {/if}
  <input type="checkbox" on:change bind:checked={value}
         on:click|preventDefault|stopPropagation={async () => {value = target ? await target.snvToggle() : !value}}/>
</label>

<style lang="scss">
  .snovy-toggle {
  }

  input {
    visibility: hidden;
    display: none;
  }
</style>
