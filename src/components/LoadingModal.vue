<script setup lang="ts">
// Credit: https://loading.io/css/

const props = defineProps<{
  show: boolean;
}>();

const loadingModal = ref<HTMLDialogElement | null>(null);

watch(
  () => props.show,
  () => {
    if (!loadingModal.value) return;
    if (props.show) {
      loadingModal.value.showModal();
    } else {
      loadingModal.value.close();
    }
  }
);
</script>

<template>
  <dialog ref="loadingModal" class="loading-modal" @cancel.prevent>
    <div class="lds-ripple">
      <div></div>
      <div></div>
    </div>
  </dialog>
</template>

<style>
.loading-modal {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: transparent;
  border: none;
}

.lds-ripple {
  display: inline-block;
  position: relative;
  width: 80px;
  height: 80px;
}

.lds-ripple div {
  position: absolute;
  border: 4px solid #fff;
  opacity: 1;
  border-radius: 50%;
  animation: lds-ripple 1s cubic-bezier(0, 0.2, 0.8, 1) infinite;
}

.lds-ripple div:nth-child(2) {
  animation-delay: -0.5s;
}

@keyframes lds-ripple {
  0% {
    top: 36px;
    left: 36px;
    width: 0;
    height: 0;
    opacity: 0;
  }
  4.9% {
    top: 36px;
    left: 36px;
    width: 0;
    height: 0;
    opacity: 0;
  }
  5% {
    top: 36px;
    left: 36px;
    width: 0;
    height: 0;
    opacity: 1;
  }
  100% {
    top: 0px;
    left: 0px;
    width: 72px;
    height: 72px;
    opacity: 0;
  }
}
</style>
