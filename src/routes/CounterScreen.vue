<template>
  <div
    class="counter-screen"
    :style="backgroundGradients"
  >
    <tiles :items="players">
      <template slot="item" scope="props">
        <player :player="props.item" />
      </template>
    </tiles>
    <main-menu />
    <transition
      enter-active-class="fadeIn"
      leave-active-class="fadeOut"
    >
      <router-view />
    </transition>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

import { backgroundColors, backgroundDirections } from '@/config'
import Tiles from '@/components/layout/Tiles'
import Player from '@/components/Player'
import MainMenu from '@/components/MainMenu'

export default {
  name: 'CounterScreen',
  components: { Tiles, Player, MainMenu },
  computed: {
    ...mapGetters(['players', 'playersColors', 'numberOfPlayers']),
    backgroundGradients () {
      let backgroundImageValues = `url("${require('../assets/background.png')}"), linear-gradient(to bottom, rgba(255, 255, 255, 0.25), rgba(255, 255, 255, 0.25))`
      const direction = this.numberOfPlayers > 2 ? 'moreThanTwo' : 'upToTwo'
      const spread = this.numberOfPlayers > 2 ? '50%' : '65%'

      this.playersColors.forEach((color, index) => {
        if (color) {
          backgroundImageValues += `, linear-gradient(to ${backgroundDirections[direction][index]}, ${backgroundColors[color][0]}, ${backgroundColors[color][1]}, transparent ${spread})`
        }
      })

      return { backgroundImage: backgroundImageValues }
    }
  }
}
</script>

<style scoped>
  .counter-screen {
    height: 100%;
    background-position: center, left top;
    background-size: cover, auto;
    transition: filter 0.3s;
  }
</style>
