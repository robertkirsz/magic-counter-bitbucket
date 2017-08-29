<template>
  <div class="content">
    <live-game-screen v-if="isLiveGame" />
    <div v-else>
      <md-input-container>
        <md-input placeholder="Game name" v-model="gameName" />
      </md-input-container>
      <md-button class="md-raised md-primary" @click="createLiveGame(gameName)" :disabled="!gameName">
        Create
      </md-button>
      <md-button class="md-raised md-primary" @click="joinLiveGame(gameName)" :disabled="!gameName">
        Join
      </md-button>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import LiveGameScreen from '@/components/LiveGameScreen'

export default {
  name: 'LiveGame',
  components: { LiveGameScreen },
  data: () => ({ gameName: '' }),
  computed: mapGetters(['isLiveGame']),
  methods: mapActions(['createLiveGame', 'joinLiveGame'])
}
</script>

<style scoped>
  .content { padding: 8px; }
</style>
