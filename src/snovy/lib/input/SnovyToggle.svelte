<script lang="ts">

  import type {SnovyIconOption} from "../snovy-types"
  import SnovyButton from "./SnovyButton.svelte"

  export let toggled: boolean
  export let icon: SnovyIconOption
  export let iconFalse: SnovyIconOption = null //the icon doesn't necessarily change when toggling

</script>

<SnovyButton class="snovy-toggle" circular fill icon={toggled ? icon: iconFalse} on:click/>

<!--<label class="snovy-toggle icon styled-hover-fill">-->
<!--  {#if toggled}-->
<!--    <SnovyIcon circular wrap name={icon}/>-->
<!--  {:else}-->
<!--    <SnovyIcon circular wrap name={iconFalse}/>-->
<!--  {/if}-->
<!--  <input type="checkbox" on:change on:click|preventDefault|stopPropagation bind:checked={toggled}/>-->
<!--</label>-->

<style lang="scss">
  .snovy-toggle {
    --border-width: var(--border-thin);

    font-size: var(--font-medium);
    color: inherit;
    background-color: transparent;
    border: unset;

    //input {
    //  visibility: hidden;
    //  display: none;
    //}
  }
</style>
