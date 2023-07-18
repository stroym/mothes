import "./style/app.scss"
import App from "./App.svelte"
import whatInput from "what-input"
import Database from "./data/Database"
import generate from "./data/Generator"

export const dexie = new Database()

whatInput.specificKeys([9])

if (!dexie.notebooks.toArray()) {
  await generate()
}

new App({
  target: document.getElementById("snovy-app")
})
