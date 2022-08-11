import type { App, DefineComponent, Plugin } from "vue";
import type { ClockConfig } from "./useClock";

declare module 'vue3clock' {
    const Vue3Clock: Plugin & DefineComponent<ClockConfig, {}, any>
    export default Vue3Clock
    export const install: (app: App, name?: string) => void
    export * from "./util";
    export { DefaultConfig, UseClock } from "./useClock";
    export type { ClockConfig } from "./useClock";
}