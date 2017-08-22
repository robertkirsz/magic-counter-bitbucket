<!--
  This component is a part of the screen dedicated to one player.
  It also rotates each space accordingly to its order so that
  every even tile is rotated by 180 degree.
-->

<template>
  <transition
    appear
    enter-active-class="fadeIn"
    leave-active-class="fadeOut"
  >
    <div class="tile" :style="style">
      <slot />
    </div>
  </transition>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'Tile',
  computed: {
    ...mapGetters([
      'numberOfPlayers',
      'divider'
    ]),
    style () {
      return {
        width: `${100 / this.divider}vw`,
        fontSize: `${4.5 / this.divider}vmin`
      }
    }
  }
}
</script>

<style scoped>
.tile {
  display: flex;
  flex-direction: column;
  justify-content: center;
  min-height: 50%;
}

.tile:nth-of-type(even):not(:only-of-type) {
  transform: rotate(180deg);
}
</style>
