<template>
  <div class="player">
    <color-picker
      v-if="!player.color"
      :playerId="player.id"
    />
    <counter
      v-else
      type="life"
      :value="player.life"
      :label="player.id"
      @minusClick="decreaseLife(player.id, 1)"
      @plusClick="increaseLife(player.id, 1)"
      animated
    />
    <div
      class="other"
      v-if="poisonCountersVisible || commanderCountersVisible"
    >
      <counter
        v-if="poisonCountersVisible"
        type="poison"
        :value="player.poison"
        @minusClick="removePoisonCounter(player.id, 1)"
        @plusClick="addPoisonCounter(player.id, 1)"
      />
      <counter
        v-for="commander in commanders"
        v-if="commanderCountersVisible && commander.color"
        type="commander"
        :key="commander.id"
        :value="player.commanderDamage[commander.id] || 0"
        :label="commander.id"
        @minusClick="removeCommanderDamage({
          id: player.id,
          amount: 1,
          commanderId: commander.id
        })"
        @plusClick="addCommanderDamage({
          id: player.id,
          amount: 1,
          commanderId: commander.id
        })"
      />
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import Counter from '@/components/Counter'
import ColorPicker from '@/components/ColorPicker'

export default {
  name: 'Player',
  components: { Counter, ColorPicker },
  props: { player: Object },
  computed: {
    ...mapGetters(['numberOfPlayers']),
    commanders () {
      return this.$store.getters.otherPlayers(this.player.id)
    },
    poisonCountersVisible () {
      return this.player.color && this.$store.state.app.poisonCountersVisible
    },
    commanderCountersVisible () {
      return this.player.color && this.$store.state.app.commanderCountersVisible
    }
  },
  methods: {
    ...mapActions([
      'increaseLife',
      'decreaseLife',
      'addPoisonCounter',
      'removePoisonCounter',
      'addCommanderDamage',
      'removeCommanderDamage'
    ])
  }
}
</script>

<style lang="scss">
  .player {
    flex: 1;
    display: flex;
    flex-flow: column nowrap;
    align-items: center;
    justify-content: center;
    color: rgba(0, 0, 0, 0.5);
    position: relative;
    max-height: 50vh;
    .other {
      flex: none;
      display: flex;
      flex-wrap: wrap;
      justify-content: space-around;
      width: 100%;
      margin-top: 1rem;
    }
  }
</style>
