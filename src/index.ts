import "./style/app.scss"
import App from "./App.svelte"
import whatInput from "what-input"
import Database from "./data/Database"
export const dexie = new Database()

whatInput.specificKeys([9])

const app = new App({
  target: document.getElementById("app")
})

export default app
