<!--
  A toggleable menu that can be accessed by the cog icon
  on the right side of the screen.
 -->

<template>
  <div class="main-menu">
    <md-speed-dial
      md-open="click"
      md-direction="left"
    >
      <md-button
        class="button md-icon-button"
        md-fab-trigger
      >
        <md-icon md-icon-morph>close</md-icon>
        <md-icon>settings</md-icon>
      </md-button>

      <main-menu-button
        v-for="button in buttons"
        :key="button.title"
        :button="button"
      />
    </md-speed-dial>
  </div>
</template>

<script>
import { mapState, mapGetters, mapActions } from 'vuex'
import MainMenuButton from '@/components/MainMenuButton'

export default {
  name: 'MainMenu',
  components: { MainMenuButton },
  computed: {
    ...mapState({
      poisonCountersVisible: state => state.app.poisonCountersVisible,
      settingsMenuOpened: state => state.app.settingsMenuOpened,
      commanderCountersVisible: state => state.app.commanderCountersVisible
    }),
    ...mapGetters(['numberOfPlayers', 'noPlayers']),
    buttons () {
      return [
        {
          title: 'Start new game',
          text: 'New game',
          icon: 'delete',
          iconType: 'md',
          action: this.startNewGame
        },
        {
          title: 'Reset current game',
          text: 'Reset game',
          icon: 'refresh',
          iconType: 'md',
          action: this.resetCurrentGame
        },
        {
          title: 'Remove player',
          icon: 'exposure_minus_1',
          iconType: 'md',
          action: this.removePlayer,
          disabled: this.numberOfPlayers <= 0
        },
        {
          title: 'Add player',
          icon: 'exposure_plus_1',
          iconType: 'md',
          action: this.addPlayer,
          disabled: this.numberOfPlayers >= 4
        },
        {
          title: 'Roll dice',
          icon: 'dice.svg',
          iconType: 'file',
          action: () => this.$router.push({ name: 'DiceScreen' }),
          closeOnClick: true,
          disabled: this.noPlayers
        },
        {
          title: 'Commander damage',
          icon: 'commander.svg',
          iconType: 'file',
          action: this.toggleCommanderCounters,
          active: this.commanderCountersVisible,
          disabled: this.noPlayers
        },
        {
          title: 'Poison counter',
          icon: 'poison.svg',
          iconType: 'file',
          action: this.togglePoisonCounters,
          active: this.poisonCountersVisible,
          disabled: this.noPlayers
        }
        // { icon: 'fa fa-bar-chart', title: 'Game statistics', action: () => this.$router.push({ name: 'StatisticsScreen' }) },
      ]
    }
  },
  methods: {
    ...mapActions([
      'addPlayer',
      'removePlayer',
      'startNewGame',
      'resetCurrentGame',
      'togglePoisonCounters',
      'toggleCommanderCounters'
    ]),
    clickedOutside () {
      if (this.settingsMenuOpened) {
        this.$store.dispatch('toggleSettingsMenu', false)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
  .main-menu {
    position: absolute;
    top: 50%;
    right: 0;
    width: 100%;
    color: black;
    transform: translateY(-50%);
    .md-speed-dial {
      justify-content: flex-start;
      padding: 4px 8px;
      transition: background 0.3s;
      &.md-active { background: rgba(0, 0, 0, 0.1); }
      .md-icon-button { margin: 0; }
    }
  }
</style>
