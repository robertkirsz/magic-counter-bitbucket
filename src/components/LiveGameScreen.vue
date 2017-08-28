<template>
  <div>
    <p>Game name: {{ liveGame.name }}</p>
    <p>Owner: {{ liveGame.owner.name }}</p>
    <p>Players:</p>
    <p v-for="player in liveGame.players" :key="player.id">
      {{ player.name }} {{ player.life }}
    </p>
    <md-button
      class="md-raised md-accent"
      @click.native="exitGame"
      v-text="userIsOwner ? 'Destroy' : 'Leave'"
    />
  </div>
</template>

<script>
import { mapState, mapGetters, mapActions } from 'vuex'

export default {
  name: 'LiveGame',
  computed: {
    ...mapState({
      liveGame: state => state.liveGame.gameData
    }),
    ...mapGetters(['userIsOwner'])
  },
  methods: {
    ...mapActions([
      'destroyLiveGame',
      'leaveLiveGame'
    ]),
    exitGame () {
      if (this.userIsOwner) this.destroyLiveGame()
      else this.leaveLiveGame()
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
