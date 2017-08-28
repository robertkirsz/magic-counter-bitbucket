<template>
  <div class="content">
    <live-game-screen v-if="liveGame" />
    <div v-else>
      <md-input-container>
        <md-input v-model="createGameName" />
      </md-input-container>
      <md-button
        class="md-raised md-primary"
        @click.native="createLiveGame(createGameName)"
        :disabled="!createGameName"
        v-text="'Create'"
      />
      <md-input-container>
        <md-input v-model="joinGameName" />
      </md-input-container>
      <md-button
        class="md-raised md-primary"
        @click.native="joinLiveGame(joinGameName)"
        :disabled="!joinGameName"
        v-text="'Join'"
      />
    </div>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import LiveGameScreen from '@/components/LiveGameScreen'

export default {
  name: 'LiveGame',
  components: { LiveGameScreen },
  data: () => ({ createGameName: '', joinGameName: '' }),
  computed: mapState({ liveGame: state => state.liveGame.gameData }),
  methods: mapActions(['createLiveGame', 'joinLiveGame'])
}
</script>

<style scoped>
  .content { padding: 8px; }
</style>
