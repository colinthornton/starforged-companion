<script setup lang="ts">
import {
  ChallengeTier,
  challengeTiers,
  getChallengeTierName,
} from "@/models/ChallengeTier";
import {
  ProgressTrack,
  PROGRESS_TRACK_TICKS_MIN,
  PROGRESS_TRACK_TICKS_MAX,
  markTicks,
  unmarkTicks,
} from "@/models/ProgressTrack";

useHead({ title: "Progress Tracker" });

const progressTracks = ref<ProgressTrack[]>([]);
const trackNameInput = ref("");
const selectedChallengeTier = ref<ChallengeTier>(ChallengeTier.Troublesome);

const { $socket } = useNuxtApp();

onMounted(() => {
  $socket.onmessage = (event) => {
    try {
      const parsed = JSON.parse(event.data);
      switch (parsed.action) {
        case "SET_PROGRESS_TRACKS":
          progressTracks.value = parsed.payload;
          break;
      }
    } catch {
      throw new Error("Failed to parse server payload");
    }
  };
});

function addProgressTrack(): void {
  $socket.send(
    JSON.stringify({
      action: "SET_PROGRESS_TRACKS",
      payload: progressTracks.value.concat({
        name: trackNameInput.value,
        challengeTier: selectedChallengeTier.value,
        ticks: PROGRESS_TRACK_TICKS_MIN,
      }),
    })
  );
  trackNameInput.value = "";
  selectedChallengeTier.value = ChallengeTier.Troublesome;
}

function markProgress(target: ProgressTrack, ticks: number): void {
  $socket.send(
    JSON.stringify({
      action: "SET_PROGRESS_TRACKS",
      payload: progressTracks.value.map((track) => {
        if (track !== target) {
          return track;
        }
        return {
          ...track,
          ticks,
        };
      }),
    })
  );
}

function deleteProgressTrack(target: ProgressTrack): void {
  $socket.send(
    JSON.stringify({
      action: "SET_PROGRESS_TRACKS",
      payload: progressTracks.value.filter((track) => track !== target),
    })
  );
}
</script>

<template>
  <main>
    <h1>Progress Tracker</h1>
    <section class="progress-track" v-for="track in progressTracks">
      <h2 class="name">{{ track.name }}</h2>
      <ProgressTrackBoxes :ticks="track.ticks" />
      <div class="controls">
        <button class="delete-button" @click="deleteProgressTrack(track)">
          Delete
        </button>
        <button
          class="mark-button"
          @click="markProgress(track, unmarkTicks(track))"
          :disabled="track.ticks === PROGRESS_TRACK_TICKS_MIN"
        >
          -
        </button>
        <span class="tier">{{
          getChallengeTierName(track.challengeTier)
        }}</span>
        <button
          class="mark-button"
          @click="markProgress(track, markTicks(track))"
          :disabled="track.ticks === PROGRESS_TRACK_TICKS_MAX"
        >
          +
        </button>
      </div>
    </section>
    <form class="form" @submit.prevent="addProgressTrack">
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
          <label class="label" for="progress-track-tier">Tier</label>
          <select
            v-model="selectedChallengeTier"
            id="progress-track-tier"
            class="select"
          >
            <option v-for="tier in challengeTiers" class="option" :value="tier">
              {{ getChallengeTierName(tier) }}
            </option>
          </select>
        </div>
        <button type="submit">Create</button>
      </fieldset>
    </form>
  </main>
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

.tier {
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
