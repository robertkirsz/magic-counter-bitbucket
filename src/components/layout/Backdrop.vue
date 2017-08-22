<!--
  A dark backdrop used as a background for modals
  and nested routes like dice screen. It goes back
  to previous route when clicked on, so child components
  should stop propagation of their click events.
 -->

<template>
  <div class="backdrop" @click="$router.replace('/')">
    <slot />
  </div>
</template>

<style scoped>
  .backdrop {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    position: fixed;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    background: rgba(0, 0, 0, 0.5);
    z-index: 10;
  }
</style>
