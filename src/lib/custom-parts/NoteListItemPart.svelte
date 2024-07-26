<script lang="ts">

  import type Note from "../../data/model/Note"

  export let item: Note
</script>

<div class="snovy-note-item" tabIndex={0}>
  <!--  TODO section should probably not be optional (even for single notebook mode)-->
  <div class="li-simple-content section-detail">{item.section?.title ?? ''}</div>
  <div class="note-detail">
    <div class="li-simple-content">{item.title}</div>
  </div>
</div>


<style lang="scss">
</style>
