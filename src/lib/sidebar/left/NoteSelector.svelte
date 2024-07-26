<script lang="ts">
  import SnovyList from "../../../snovy/lib/list/SnovyList.svelte"

  import {activeNote, activeNotebook, activeSection, selectNote, selectSection} from "../../note-store"
</script>

<!--TODO context menu-->

<SnovyList
  preset="editable" items={$activeNotebook?.sections} initial={$activeSection}
  onSelect={selectSection} onItemInput={async str => await $activeSection.updateTitle(str)}
/>
<SnovyList
  preset="editable" items={$activeSection?.notes} initial={$activeSection?.notes?.first()}
  onSelect={selectNote} onItemInput={async str => await $activeNote.updateTitle(str)}
  buttonOptions={{type: "toggle", icon: ["favorite_fill", "favorite"], props: {border: false}}}
/>

<style lang="scss">

</style>
