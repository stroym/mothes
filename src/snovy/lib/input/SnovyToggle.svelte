<script lang="ts">

  import type {SnovyIconOption} from "../helper/SnovyIcon.svelte"
  import type {Toggleable} from "../../../data/model/Base";
  import SnovyIcon from "../helper/SnovyIcon.svelte";

  export let target: Toggleable
  export let icons: Array<SnovyIconOption>

  let toggled: boolean

  $: {
    toggled = target.snvToggled()
  }

</script>

<label class="snovy-toggle icon styled-hover-fill" tabindex="0">
  {#if toggled}
    <SnovyIcon circular wrap name={icons.at(0)}/>
  {:else}
    <SnovyIcon circular wrap name={icons.at(-1)}/>
  {/if}
  <input type="checkbox" on:change bind:checked={toggled}
         on:click|preventDefault|stopPropagation={async () => {toggled = await target.snvToggle()}}/>
</label>

<style lang="scss">
  .snovy-toggle {
    --border-width: var(--border-thin);

    font-size: var(--font-medium);
    color: inherit;
    background-color: transparent;
    border: unset;
    outline: unset;

    input {
      visibility: hidden;
      display: none;
    }

    &:hover {
      cursor: pointer;
    }
  }
</style>
