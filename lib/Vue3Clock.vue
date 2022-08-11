<script lang="ts" setup>
import { computed, onBeforeUnmount, onMounted, ref, shallowRef } from "vue";
import { ClockConfig, DefaultConfig, UseClock } from "./useClock";

const emits = defineEmits<{
    (ev: 'clock-ready', clock: UseClock): void
}>()
const props = defineProps<{
    config?: Partial<ClockConfig>
}>()
const clockRadius = computed(() => {
    return props.config?.dialRadius ?? DefaultConfig.dialRadius
})

const clock = shallowRef<UseClock | null>(null)
const pointer = ref<HTMLCanvasElement | null>(null)
const dial = ref<HTMLCanvasElement | null>(null)

onMounted(() => {
    const dialCanvas = dial.value
    const pointerCanvas = pointer.value

    if(dialCanvas && pointerCanvas) {
        const _clock = new UseClock(dialCanvas, pointerCanvas, props.config)
        _clock.renderDial()
            .renderPointer()
        clock.value = _clock

        emits('clock-ready', _clock)
    }
})
onBeforeUnmount(() => {
    clock.value?.stopTick()
})
</script>

<template>
    <div class="vue3-clock"
         :style="`width: ${clockRadius * 2}px; height: ${clockRadius * 2}px;`">
        <canvas class="clock-canvas front" ref="pointer"
                :width="clockRadius * 2"
                :height="clockRadius * 2"/>
        <canvas class="clock-canvas back" ref="dial"
                :width="clockRadius * 2"
                :height="clockRadius * 2"/>
    </div>
</template>

<style lang="scss" scoped>
.vue3-clock {
    position: relative;
    display: block;

    .clock-canvas {
        position: absolute;
        width: 100%;
        height: 100%;
    }

    .front {
        z-index: 2;
    }

    .back {
        z-index: 1;
    }
}
</style>