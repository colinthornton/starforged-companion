<script setup lang="ts">
import { Operation } from "fast-json-patch";

import {
  ChallengeRank,
  challengeRanks,
  getChallengeRankName,
} from "@/models/ChallengeRank";
import {
  ProgressTrack,
  PROGRESS_TRACK_TICKS_MIN,
  PROGRESS_TRACK_TICKS_MAX,
  markTicks,
  unmarkTicks,
} from "@/models/ProgressTrack";

useHead({ title: "Progress Tracker" });
const { $socket } = useNuxtApp();

const connecting = ref(false);
const trackNameInput = ref("");
const selectedChallengeRank = ref<ChallengeRank>(ChallengeRank.Troublesome);
const crewState = ref<{
  progressTracks: ProgressTrack[];
}>({
  progressTracks: [],
});

onMounted(initSocket);
watch(() => $socket, initSocket);

function initSocket() {
  if (!process.client) return;

  connecting.value = true;
  $socket.value.addEventListener("message", (event) => {
    crewState.value = JSON.parse(event.data);
    connecting.value = false;
  });
}

function addProgressTrack(): void {
  const value: ProgressTrack = {
    name: trackNameInput.value,
    challengeRank: selectedChallengeRank.value,
    ticks: 0,
  };
  const operation: Operation = {
    op: "add",
    path: "/progressTracks/-",
    value,
  };
  $socket.value.send(JSON.stringify(operation));

  trackNameInput.value = "";
  selectedChallengeRank.value = ChallengeRank.Troublesome;
}

function removeProgressTrack(i: number): void {
  const operation: Operation = {
    op: "remove",
    path: `/progressTracks/${i}`,
  };
  $socket.value.send(JSON.stringify(operation));
}

function patchTicks(i: number, ticks: number): void {
  const operation: Operation = {
    op: "replace",
    path: `/progressTracks/${i}/ticks`,
    value: ticks,
  };
  $socket.value.send(JSON.stringify(operation));
}
</script>

<template>
  <main>
    <LoginButton />
    <h1>Progress Tracker</h1>
    <section
      class="progress-track"
      v-for="(track, i) in crewState.progressTracks"
    >
      <h2 class="name">{{ track.name }}</h2>
      <ProgressTrackBoxes :ticks="track.ticks" />
      <div class="controls">
        <button class="delete-button" @click="removeProgressTrack(i)">
          Delete
        </button>
        <button
          class="mark-button"
          @click="patchTicks(i, unmarkTicks(track))"
          :disabled="track.ticks === PROGRESS_TRACK_TICKS_MIN"
        >
          -
        </button>
        <span class="rank">{{
          getChallengeRankName(track.challengeRank)
        }}</span>
        <button
          class="mark-button"
          @click="patchTicks(i, markTicks(track))"
          :disabled="track.ticks === PROGRESS_TRACK_TICKS_MAX"
        >
          +
        </button>
      </div>
    </section>
    <form class="form" @submit.prevent="addProgressTrack()">
      <fieldset class="fieldset">
        <legend>New Progress Track</legend>
        <div class="input-group">
          <label class="label" for="progress-track-name">Name</label>
          <input
            v-model="trackNameInput"
            id="progress-track-name"
            class="input"
            type="text"
            required
            autocomplete="off"
          />
        </div>
        <div class="input-group">
          <label class="label" for="progress-track-rank">Rank</label>
          <select
            v-model="selectedChallengeRank"
            id="progress-track-rank"
            class="select"
          >
            <option v-for="rank in challengeRanks" class="option" :value="rank">
              {{ getChallengeRankName(rank) }}
            </option>
          </select>
        </div>
        <button type="submit">Create</button>
      </fieldset>
    </form>
  </main>

  <LoadingModal :show="connecting" />
</template>

<style>
main {
  margin: 0 auto;
  padding: 0 0.4rem;
  max-width: 65ch;
  font-family: ui-monospace, Menlo, Monaco, "Cascadia Mono", "Segoe UI Mono",
    "Roboto Mono", "Oxygen Mono", "Ubuntu Monospace", "Source Code Pro",
    "Fira Mono", "Droid Sans Mono", "Courier New", monospace;
}

.progress-track {
  margin-top: 2rem;
}

.name {
  font-weight: 700;
  font-size: 1.2em;
}

.rank {
  font-style: italic;
  margin: 0 2ch;
}

.controls {
  margin-top: 0.2rem;
  display: flex;
  justify-content: flex-end;
  align-items: center;
}

.delete-button {
  margin-right: auto;
}

.mark-button {
  width: 2em;
  height: 2em;
}

.form {
  margin-top: 2rem;
}

.fieldset {
  display: grid;
  row-gap: 0.4em;
}

.input-group {
  width: 100%;
  display: flex;
  justify-content: flex-start;
}

.label {
  flex: 2;
}

.label::after {
  content: ":";
}

.input,
.select {
  flex: 8;
}

.select,
.select .option {
  text-transform: capitalize;
}

button[type="submit"] {
  margin-top: 0.8rem;
}
</style>
