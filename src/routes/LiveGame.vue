<template>
  <div v-if="userSignedIn" class="content">
    <div v-if="!liveGame">
      <md-input-container>
        <md-input v-model="createGameName"></md-input>
      </md-input-container>
      <md-button
        class="md-raised md-primary"
        @click.native="createLiveGame(createGameName)"
        v-text="'Create'"
      />
      <md-input-container>
        <md-input v-model="joinGameName"></md-input>
      </md-input-container>
      <md-button
        class="md-raised md-primary"
        @click.native="joinLiveGame(joinGameName)"
        v-text="'Join'"
      />
    </div>
    <div v-if="liveGame">
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
  </div>
</template>

<script>
import { mapState, mapGetters, mapActions } from 'vuex'

export default {
  name: 'LiveGame',
  data: () => ({
    createGameName: '',
    joinGameName: ''
  }),
  computed: {
    ...mapState({
      liveGame: state => state.liveGame.gameData,
      userSignedIn: state => state.session.signedIn
    }),
    ...mapGetters(['userIsOwner'])
  },
  methods: {
    ...mapActions(['createLiveGame', 'joinLiveGame', 'destroyLiveGame', 'leaveLiveGame']),
    exitGame () {
      if (this.userIsOwner) this.destroyLiveGame()
      else this.leaveLiveGame()
    }
  },
  watch: {
    userSignedIn (nextVal, prevVal) {
      if (prevVal && !nextVal) this.$router.push('/sign-in')
    }
  }
}
</script>

<style lang="scss" scoped>
  .content {
    padding: 8px;
  }
</style>
