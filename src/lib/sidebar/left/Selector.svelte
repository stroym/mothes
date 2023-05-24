<script lang="ts">
  import SnovyList from "../../../snovy/lib/list/SnovyList.svelte";

  import {activeNote, activeNotebook, activeSection, selectNote, selectSection} from "../../note-store";

</script>

<!--TODO context menu-->

<SnovyList preset="editable" items={$activeNotebook?.sections} onSelect={selectSection} initial={$activeSection}/>
<SnovyList preset="editable" items={$activeSection?.notes} onSelect={selectNote} initial={$activeNote}
           childButton={{type: "toggle", action: note => {
               console.log("star")
               note.star()
           }, icon: "favorite_fill", iconFalse: "favorite"}}
/>

<style lang="scss">

</style>
