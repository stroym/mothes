<script lang="ts">

  import Note from "../../../data/model/Note"

  export let onAction: (args) => {}
  export let item: Note
  export let favorite: boolean = false
</script>

<div class="snovy-note-item" tabIndex={0} on:click={onAction}>
<!--  TODO section should probably not be optional (even for single notebook mode)-->
  <div class="li-simple-content section-detail">{item.section?.title ?? ''}</div>
  <div class="note-detail">
    <div class="li-simple-content">{item.title}</div>
    {#if favorite}
      <button></button>
    {/if}
  </div>
</div>


<style lang="scss">
</style>
