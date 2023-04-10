<script lang="ts">
  import List from "../../../snovy/list/List.svelte";

  import {activeNote, activeNotebook, activeSection, selectNote, selectSection} from "../../note-store";
  import NoteListItemPart from "../../../snovy/list/custom-parts/NoteListItemPart.svelte";
</script>

<!--TODO context menu-->

<List preset="editable" items={$activeNotebook?.sections} onSelect={selectSection} initial={$activeSection}/>
<List preset="editable" items={$activeSection?.notes} onSelect={selectNote} initial={$activeNote}
      custom={{component: NoteListItemPart, props: {}, button: { icon: "favorite", action: () => {} }}}
/>

<style lang="scss">

</style>
