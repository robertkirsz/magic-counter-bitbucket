<!--
  Allows players to "roll" dice. It creates a "Die" component
  for each player that can be "rolled" by clicking on it.
  That generates a random number from 1 to 6.
 -->

<template>
  <transition
    enter-active-class="fadeIn"
    leave-active-class="fadeOut"
  >
    <backdrop>
      <tiles :items="dice">
        <template slot="item" scope="props">
          <die
            :value="props.item"
            @click.native.stop="rollDie(props.index)"
          />
        </template>
      </tiles>
    </backdrop>
  </transition>
</template>

<script>
import { mapGetters } from 'vuex'
import _times from 'lodash/times'
import _random from 'lodash/random'
import Backdrop from '@/components/layout/Backdrop'
import Tiles from '@/components/layout/Tiles'
import Die from '@/components/Die'

export default {
  name: 'DiceScreen',
  components: { Backdrop, Tiles, Die },
  data () {
    return {
      dice: []
    }
  },
  beforeMount () {
    this.rollDice()
  },
  computed: {
    ...mapGetters([
      'numberOfPlayers',
      'lastPlayerIndex'
    ])
  },
  methods: {
    rollDice () {
      this.dice = _times(this.numberOfPlayers, () => _random(1, 6))
    },
    rollDie (index) {
      const oldValue = this.dice[index]
      let newValue

      do {
        newValue = _random(1, 6)
      } while (newValue === oldValue)

      this.$set(this.dice, index, newValue)
    }
  },
  watch: {
    numberOfPlayers () {
      this.rollDice()
    }
  }
}
</script>
