import type { App } from "vue";
import Vue3Clock from "./Vue3Clock.vue";

const install = (app: App, name?: string) => {
    app.component(name || 'Vue3Clock', Vue3Clock)
}
Vue3Clock.install = install

export default Vue3Clock
export * from "./util"
export { DefaultConfig, UseClock } from "./useClock"
export type { ClockConfig } from "./useClock"