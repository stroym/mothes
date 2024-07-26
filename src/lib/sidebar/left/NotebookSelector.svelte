<script lang="ts">
  import SnovyList from "../../../snovy/lib/list/SnovyList.svelte"

  import {activeNote, activeNotebook, notebooks, selectNotebook} from "../../note-store"
</script>

<SnovyList
  preset="editable" items={$notebooks} initial={$activeNotebook}
  onSelect={selectNotebook} onItemInput={async str => await $activeNotebook.updateTitle(str)}
/>

<style lang="scss">

</style>
