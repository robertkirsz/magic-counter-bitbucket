<template>
  <div class="live-game-screen">
    <p>Game name: {{ liveGame.name }}</p>
    <p>Owner: {{ liveGame.owner.name }}</p>
    <p>Players:</p>

    <p v-for="player in otherLivePlayers" :key="player.id">
      {{ player.name }} {{ player.life }}
    </p>

    <counter
      type="life"
      :value="userLivePlayer.life"
      @minusClick="decreaseLivePlayerLife"
      @plusClick="increaseLivePlayerLife"
    />
  </div>
</template>

<script>
import { mapState, mapGetters, mapActions } from 'vuex'
import Counter from '@/components/Counter'

export default {
  name: 'LiveGameScreen',
  components: { Counter },
  computed: {
    ...mapState({ liveGame: state => state.liveGame }),
    ...mapGetters(['userLivePlayer', 'otherLivePlayers'])
  },
  methods: mapActions(['increaseLivePlayerLife', 'decreaseLivePlayerLife'])
}
</script>

<style lang="scss" scoped>
  .live-game-screen {
    flex: 1;
    display: flex;
    flex-direction: column;
    > .counter {
      margin-top: auto;
      margin-bottom: 50px;
    }
  }
</style>
