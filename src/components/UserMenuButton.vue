<template>
  <md-speed-dial
    md-open="click"
    md-direction="top"
    class="user-menu md-fab-bottom-right"
  >
    <md-button
      class="main-button md-icon-button"
      md-fab-trigger
    >
      <md-avatar v-if="user.photoURL" class="avatar">
        <img :src="user.photoURL" alt="Avatar">
      </md-avatar>
      <md-button v-else class="md-fab md-primary md-mini md-clean">
        <md-icon md-icon-morph>close</md-icon>
        <md-icon :md-iconset="buttonIcon" />
      </md-button>
    </md-button>

    <md-button
      v-for="button in buttons"
      v-if="!button.hidden"
      :key="button.id"
      class="list-button md-fab md-primary md-mini md-clean"
      @click.native="button.action"
      style="position: relative;"
    >
      <span class="label" v-text="button.label" />
      <md-icon
        v-text="button.iconType === 'md' ? button.icon : null"
        :md-iconset="button.iconType === 'fa' ? `fa fa-${button.icon}` : null"
      />
    </md-button>
  </md-speed-dial>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'

// TODO: add icon morph to avatar button
export default {
  name: 'UserMenu',
  computed: {
    ...mapGetters(['isLiveGame', 'userIsOwner']),
    signedIn () {
      return this.$store.state.session.signedIn
    },
    user () {
      return this.$store.state.user
    },
    buttonIcon () {
      if (this.signedIn) return 'fa fa-user'
      return 'fa fa-user-times'
    },
    buttons () {
      return [
        {
          id: 0,
          label: 'Go back',
          icon: 'arrow-left',
          iconType: 'fa',
          action: () => this.$router.push({ name: 'CounterScreen' }),
          hidden: this.$route.name === 'CounterScreen'
        },
        {
          id: 1,
          label: 'Leave game',
          icon: 'times',
          iconType: 'fa',
          action: () => this.leaveLiveGame(),
          hidden: !this.isLiveGame || this.userIsOwner
        },
        {
          id: 2,
          label: 'Stop game',
          icon: 'times',
          iconType: 'fa',
          action: () => this.destroyLiveGame(),
          hidden: !this.isLiveGame || !this.userIsOwner
        },
        {
          id: 3,
          label: 'Live game',
          icon: 'gamepad',
          iconType: 'fa',
          action: () => this.$router.push({ name: 'LiveGame' }),
          hidden: this.$route.name === 'LiveGame' || !this.signedIn
        },
        {
          id: 4,
          label: 'Sign in',
          icon: 'sign-in',
          iconType: 'fa',
          action: () => this.$router.push({ name: 'SignIn' }),
          hidden: this.$route.name === 'SignIn' || this.signedIn
        },
        {
          id: 5,
          label: 'Sign out',
          icon: 'sign-out',
          iconType: 'fa',
          action: () => this.$store.dispatch('signOut'),
          hidden: !this.signedIn
        }
      ]
    }
  },
  methods: {
    ...mapActions(['destroyLiveGame', 'leaveLiveGame'])
  }
}
</script>

<style scoped>
  .user-menu {
    bottom: 8px;
    right: 8px;
    z-index: 200;
  }

  .avatar {
    pointer-events: none;
  }

  .main-button {
    padding: 0;
  }

  .list-button {
    overflow: visible;
  }

  .label {
    position: absolute;
    top: 50%;
    right: 115%;
    padding: 4px;
    background: rgba(0, 0, 0, 0.5);
    border-radius: 2px;
    font-size: 0.9em;
    line-height: 1;
    color: white;
    transform: translateY(-50%);
  }
</style>
