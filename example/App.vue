<script lang="ts" setup>
import { nextTick, onBeforeUnmount, ref, shallowRef, watch } from "vue";
import Vue3Clock, { ClockConfig, DefaultConfig, UseClock } from "../lib"

type DashboardConfigType = {
    [k in keyof ClockConfig]?:
    {
        type: 'number' | 'color' | 'enum'
        range?: [ number, number ]
        step?: number
        enums?: { label: string, value: any }[]
        desc: string
    }
}
const dashboardConfig: DashboardConfigType = {
    dialRadius: {
        type: 'number',
        range: [ 0, 500 ],
        step: 1,
        desc: '表盘半径'
    },
    dialStroke: {
        type: 'color',
        desc: '表盘线框颜色'
    },
    dialStrokeWidth: {
        type: 'number',
        range: [ 0, 10 ],
        step: 1,
        desc: '表盘线框粗细'
    },
    numberShow: {
        type: 'enum',
        enums: [
            { label: '显示', value: true },
            { label: '隐藏', value: false },
        ],
        desc: '是否显示文字'
    },
    numberStyle: {
        type: 'enum',
        enums: [
            { label: '描边', value: 'stroke' },
            { label: '填充', value: 'fill' },
        ],
        desc: '数字风格'
    },
    numberText: {
        type: 'enum',
        enums: [
            { label: '阿拉伯数字', value: 'Arab' },
            { label: '罗马数字', value: 'Roma' },
        ],
        desc: '数字风格'
    },
    numberColor: {
        type: 'color',
        desc: '数字颜色'
    },
    hourPercent: {
        type: 'number',
        range: [ 0, 1 ],
        step: 0.1,
        desc: '时针占半径比例'
    },
    hourStroke: {
        type: 'color',
        desc: '时针颜色'
    },
    hourStrokeWidth: {
        type: 'number',
        range: [ 0, 10 ],
        step: 1,
        desc: '分针粗细'
    },
    minutePercent: {
        type: 'number',
        range: [ 0, 1 ],
        step: 0.1,
        desc: '分针占半径比例'
    },
    minuteStroke: {
        type: 'color',
        desc: '分针颜色'
    },
    minuteStrokeWidth: {
        type: 'number',
        range: [ 0, 10 ],
        step: 1,
        desc: '分针粗细'
    },
    secondPercent: {
        type: 'number',
        range: [ 0, 1 ],
        step: 0.1,
        desc: '秒针占半径比例'
    },
    secondStroke: {
        type: 'color',
        desc: '秒针颜色'
    },
    secondStrokeWidth: {
        type: 'number',
        range: [ 0, 10 ],
        step: 1,
        desc: '秒针粗细'
    }
}

const clock = shallowRef<UseClock | null>(null)
const ready = (_clock: UseClock) => {
    clock.value = _clock
    console.log('[v3clock] ready')
}

const dashboardBindData = ref<ClockConfig>({ ...DefaultConfig })
const update = () => {
    clock.value?.rerender(dashboardBindData.value)
    console.log('[v3clock] re-render')
}

onBeforeUnmount(() => {
    console.log('[v3clock] dispose')
})
</script>

<template>
    <div class="app-view">
        <div class="clock-container with-scroll">
            <Vue3Clock :config="{dialRadius: dashboardBindData.dialRadius}" @clock-ready="ready"/>
        </div>
        <div class="dashboard-container with-scroll">
            <div class="config-item">
                配置项
            </div>
            <div class="config-item" :key="key"
                 v-for="(configItem, key) in dashboardConfig">
                <div class="config-name" :title="configItem.desc">
                    {{ key }}
                </div>
                <div class="config-value"
                     v-if="configItem.type === 'number'">
                    <input v-if="configItem.type === 'number'" type="range"
                           :min="configItem.range?.[0] ?? 0"
                           :max="configItem.range?.[1] ?? 100"
                           :step="configItem.step"
                           v-model="dashboardBindData[key]"
                           @change="update">
                    <span class="value-box">{{ dashboardBindData[key] }}</span>
                </div>
                <div class="config-value"
                     v-if="configItem.type === 'color'">
                    <input type="color" v-model="dashboardBindData[key]" @change="update">
                    <span class="value-box">{{ dashboardBindData[key] }}</span>
                </div>
                <div class="config-value"
                     v-if="configItem.type === 'enum'">
                    <div :class="dashboardBindData[key] === opt.value ? 'optional-item__active' : 'optional-item'"
                         v-for="(opt, optIdx) in configItem.enums" :key="optIdx"
                         @click="dashboardBindData[key] = opt.value; update()">
                        {{ opt.label }}
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style lang="scss" scoped>
.app-view {
    position: relative;
    width: 100%;
    height: 100%;
    color: #7b7b7b;
    font-size: 14px;
    display: flex;
    align-items: center;
    justify-content: space-between;

    .clock-container {
        position: relative;
        width: 40%;
        height: 100%;
        overflow: auto;
    }

    .dashboard-container {
        position: relative;
        width: 60%;
        height: 100%;
        overflow: auto;

        .config-item {
            position: relative;
            width: 100%;
            height: 32px;
            display: flex;
            align-items: center;
            justify-content: flex-start;

            .config-name {
                width: 200px;
                font-style: italic;
            }

            .config-value {
                width: calc(100% - 200px);

                .value-box {
                    margin-left: 16px;
                }

                .optional-item {
                    padding: 0 8px;
                    border: solid 1px #eee;
                    cursor: pointer;
                    display: inline-block;

                    &__active {
                        @extend .optional-item;
                        background-color: aliceblue;
                    }
                }
            }
        }
    }
}
</style>
