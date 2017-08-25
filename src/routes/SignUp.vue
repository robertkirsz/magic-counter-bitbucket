<template>
  <div class="container">
    <form @submit.prevent="signUp" novalidate>
      <email-input
        v-model="email"
        :showError="isEmailError"
        :errorMessage="error.message"
      />
      <password-input
        v-model="password"
        :showError="isPasswordError"
        :errorMessage="error.message"
      />
      <md-button
        type="submit"
        class="md-raised md-primary"
      />
        Sign up
      </md-button>
    </form>
    <p>
      <router-link to="sign-in">Sign in</router-link>
    </p>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import EmailInput from '@/components/EmailInput'
import PasswordInput from '@/components/PasswordInput'

export default {
  name: 'SignUp',
  components: { EmailInput, PasswordInput },
  data () {
    return {
      email: '',
      password: ''
    }
  },
  computed: {
    signedUp () {
      return this.$store.state.session.signedUp
    },
    ...mapGetters(['firstErrorOfType', 'isEmailError', 'isPasswordError']),
    error () {
      return this.firstErrorOfType('auth/')
    }
  },
  methods: {
    signUp () {
      this.$store.dispatch('signUp', { email: this.email, password: this.password })
    }
  },
  watch: {
    signedUp (newVal, oldVal) {
      if (!oldVal || newVal) {
        this.email = ''
        this.password = ''
        this.$router.replace('/')
      }
    }
  }
}
</script>

<style scoped>
  .container {
    flex: 1;
    display: flex;
    flex-direction: column;
    width: 100%;
    max-width: 380px;
    margin: 0 auto;
    padding: 24px;
  }

  p {
    text-align: center;
  }

  form {
    display: flex;
    flex-direction: column;
  }
</style>
