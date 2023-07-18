<script lang="ts">
  import SnovyList from "../../../snovy/lib/list/SnovyList.svelte"

  import {activeNote, activeNotebook, activeSection, selectNote, selectSection} from "../../note-store"
</script>

<!--TODO context menu-->

<SnovyList
  preset="editable" items={$activeNotebook?.sections} onSelect={selectSection} initial={$activeSection}
/>
<SnovyList preset="editable" items={$activeSection?.notes} onSelect={selectNote} initial={$activeSection?.notes?.first()}
           childButton={{type: "toggle", toggled: note => note.favorite, action: async note => await note.star(), icon: "favorite_fill", iconFalse: "favorite"}}
           onItemInput={async str => await $activeNote.updateTitle(str)}
/>

<style lang="scss">

</style>
