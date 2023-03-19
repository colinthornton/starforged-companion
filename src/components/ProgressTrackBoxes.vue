<script setup lang="ts">
import {
  PROGRESS_TRACK_BOXES,
  PROGRESS_TRACK_TICKS_PER_BOX,
} from "@/models/ProgressTrack";

defineProps<{
  ticks: number;
}>();
</script>

<template>
  <div class="boxes">
    <div v-for="i in PROGRESS_TRACK_BOXES" class="box">
      <svg
        class="ticks"
        viewBox="0 0 20 20"
        xmlns="http://www.w3.org/2000/svg"
        style="stroke: black"
      >
        <path
          v-show="ticks > (i - 1) * PROGRESS_TRACK_TICKS_PER_BOX"
          d="M10 1 l0 18"
          transform="rotate(135 10 10)"
        />
        <path
          v-show="ticks > (i - 1) * PROGRESS_TRACK_TICKS_PER_BOX + 1"
          d="M10 1 l0 18"
          transform="rotate(45 10 10)"
        />
        <path
          v-show="ticks > (i - 1) * PROGRESS_TRACK_TICKS_PER_BOX + 2"
          d="M10 1 l0 18"
        />
        <path
          v-show="ticks > (i - 1) * PROGRESS_TRACK_TICKS_PER_BOX + 3"
          d="M10 1 l0 18"
          transform="rotate(90 10 10)"
        />
      </svg>
    </div>
  </div>
</template>

<style>
.boxes {
  display: grid;
  grid-template-columns: repeat(10, 1fr);
  grid-template-rows: auto;
  max-width: 100%;
}

.box {
  border: 1px solid black;
}

.box:not(:first-child) {
  border-left: none;
}

.ticks {
  display: block;
  width: 100%;
  height: auto;
}
</style>
