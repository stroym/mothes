<script lang="ts">

  import SnovyButton from "../../../snovy/lib/input/SnovyButton.svelte";
  import SnovyLabel from "../../../snovy/lib/input/SnovyLabel.svelte";
  import {dexie} from "../../../index";
  import generate from "../../../data/Generator";
  import {exportData, fetchThemes, importData} from "../../../data/Database";
  import {onMount} from "svelte";
  import type {Theme} from "../../../data/model/options/Theme";
  import {defaults} from "../../../data/model/options/Defaults";
  import {activeOptions} from "../../stores/options-store";
  import type Options from "../../../data/model/options/Options";

  export let dialog: HTMLDialogElement = null
  let importInput: HTMLInputElement = null

  let themes: Array<Theme> = []
  let options: Options = $activeOptions.clone()
  let theme: Theme = undefined

  onMount(
    () => {
      getThemes()

      return () => {
        if (JSON.stringify($activeOptions) !== JSON.stringify(options)) {
          if ((confirm("You have unsaved changes. Would you like to save them?"))) {
            submit()
          } else {
            cancel()
          }
        }
      }
    }
  )

  async function getThemes() {
    themes = await fetchThemes()

    theme = themes.find(it => it.id == options.themeId)
  }

  const fetchTheme = async () => {
    theme = await dexie.themes.get(options.themeId)
  }

  const submit = async () => {
    await theme?.save()
    options.themeId = theme?.id
    activeOptions.set(await options.save())
    //update current options etc.
  }

  const restore = async () => {
    await dexie.transaction("rw", dexie.themes, dexie.options, async () => {
      await dexie.themes.clear()
      await dexie.themes.bulkAdd(defaults.themes)

      const defaultOptions = defaults.options
      const newThemes = await dexie.themes.toArray()
      const firstTheme = newThemes.first()!
      defaultOptions.themeId = firstTheme.id

      await dexie.options.clear()
      await dexie.options.add(defaultOptions)

      activeOptions.set(defaultOptions)

      options = defaultOptions
      themes = newThemes
      theme = firstTheme
    })
  }

  const cancel = async () => {
    await getThemes()

    options = $activeOptions.clone()
    await fetchTheme()
  }

  const mockData = async () => {
    await generate()
    location.reload()
  }

  const purgeData = async () => {
    await dexie.delete()
    location.reload()
  }

</script>

<svelte:options accessors/>

<dialog id="app-options" open bind:this={dialog}>
  <div id="import-export" class="options-container">
    <SnovyLabel value="Import">
      <svelte:fragment slot="after">
        <SnovyButton icon="import" border on:click={() => importInput?.click()}/>
        <input bind:this={importInput} type="file" accept="application/json"
               on:change={e => importData(e.target.files)}
        />
      </svelte:fragment>
    </SnovyLabel>
    <SnovyLabel value="Export">
      <SnovyButton slot="after" icon="export" border on:click={exportData}/>
    </SnovyLabel>
    <SnovyLabel value="Mock">
      <SnovyButton slot="after" icon="add" border on:click={mockData}/>
    </SnovyLabel>
    <SnovyLabel value="Drop">
      <SnovyButton slot="after" icon="remove" border on:click={purgeData}/>
    </SnovyLabel>
  </div>

  <!--  <ThemeManager themes={themes} setThemes={setThemes} currentTheme={theme} setCurrentTheme={setTheme}/>-->

  <div id="control-buttons">
    <SnovyButton value="Restore defaults" border onClick={restore}/>
    <SnovyButton value="Cancel" border onClick={cancel}/>
    <SnovyButton type="submit" value="Save" border onClick={submit}/>
  </div>
</dialog>

<style lang="scss">
  #app-options {
    width: calc(98vw - var(--border-thin));
    height: 100%;
    margin-inline: auto 0;
    z-index: 100;

    display: grid;
    grid-template-columns: repeat(6, 1fr);
    grid-template-rows: 1fr 10%;
    gap: 0.5em 1em;
    justify-items: center;
    align-items: start;

    #import-export {
      grid-area: 1 / 1 / span 1 / span 1;
      display: grid;
      grid-template-columns: min-content 50%;
      grid-auto-rows: min-content;
      gap: 0.5em;

      :global .snovy-label {
        width: 100%;
      }
    }

    #theme-options {
      grid-area: 1 / 3 / span 1 / span 2;
      display: grid;
      grid-template-areas: "combo" "inputs" "buttons";
      gap: 1em;
      padding: 0 1em;
      max-height: 100%;
      width: 100%;

      .snovy-input-group {
        grid-area: inputs;
        display: grid;
        grid-template-columns: min-content 50%;
        grid-auto-rows: min-content;
        gap: 0.5em;
        justify-content: space-between;

        .snovy-input-color {
          width: unset;
        }
      }

      .snovy-button-group {
        grid-area: buttons;
        display: grid;
        grid-template-columns: repeat(2, 1fr);

        .snovy-button {
          margin: 0.2em;
        }
      }
    }

    #control-buttons {
      grid-area: 2 / 5 / span 1 / span 2;
      justify-self: end;
      align-self: center;
      gap: 1em;

      display: flex;
      flex-flow: row nowrap;
      align-items: center;
      justify-content: flex-end;
    }
  }
</style>
