<template>
  <transition
    appear
    enter-active-class="scaleIn"
    leave-active-class="scaleOut"
  >
    <div class="container">
      <div class="color-picker">
        <img
          v-for="mana in manaColors"
          :key="mana"
          class="md-whiteframe-10dp"
          :class="mana"
          :src="require(`../assets/mana/${mana}.svg`)"
          alt="Mana symbol"
          @click="chooseColor({ id: playerId, color: mana })"
          :disabled="playersColors.includes(mana)"
        />
      </div>
    </div>
  </transition>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'

export default {
  name: 'ColorPicker',
  props: { playerId: Number },
  data () {
    return {
      manaColors: ['white', 'blue', 'black', 'red', 'green']
    }
  },
  computed: {
    ...mapGetters(['playersColors'])
  },
  methods: {
    ...mapActions(['chooseColor'])
  }
}
</script>

<style lang="scss" scoped>
$imgSize: 3.7em;

.container {
  display: flex;
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
}

.color-picker {
  position: relative;
  width: 12em;
  height: 12em;
  max-width: 33vh;
  max-height: 33vh;
  margin: auto;
  transition: width 0.3s, height 0.3s;
}

img {
  position: absolute;
  width: $imgSize;
  height: $imgSize;
  max-width: 9vh;
  max-height: 9vh;
  border-radius: 50%;
  transition: width 0.3s, height 0.3s;
  &[disabled] {
    opacity: 0.25;
    pointer-events: none;
  }
}

.white {
  top: 0;
  left: 50%;
  transform: translate3d(-50%, -50%, 0);
}

.blue {
  top: 25%;
  right: 0;
  transform: translate3d(50%, 0, 0);
}

.black {
  bottom: -10%;
  right: 5%;
}

.red {
  bottom: -10%;
  left: 5%;
}

.green {
  top: 25%;
  left: 0;
  transform: translate3d(-50%, 0, 0);
}
</style>
