<script lang="ts" setup>
import Vue3Clock, { ClockConfig } from "../lib"
</script>

<template>
    <div class="app-view">
        <div class="clock-container with-scroll">
            <Vue3Clock/>
        </div>
        <div class="dashboard-container with-scroll">

        </div>
    </div>
</template>

<style lang="scss" scoped>
.app-view {
    position: relative;
    width: 100%;
    height: 100%;
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
    }
}
</style>
