<template>
  <div class="container">
    <form @submit.prevent="signIn" novalidate>
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
        v-text="signInButtonText"
      />
    </form>
    <p>Or continue with</p>
    <social-buttons @providerChosen="signInWithProvider" />
    <p>
      <router-link to="sign-up">Or sign up</router-link>
    </p>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import EmailInput from '@/components/EmailInput'
import PasswordInput from '@/components/PasswordInput'
import SocialButtons from '@/components/SocialButtons'

export default {
  name: 'SignIn',
  components: { EmailInput, SocialButtons, PasswordInput },
  data () {
    return {
      email: '',
      password: ''
    }
  },
  computed: {
    signedIn () {
      return this.$store.state.session.signedIn
    },
    ...mapGetters(['firstErrorOfType', 'isEmailError', 'isPasswordError']),
    error () {
      return this.firstErrorOfType('auth/')
    },
    signInButtonText () {
      return this.$store.state.session.signingIn ? 'Signing...' : 'Sign in' // TODO: replace with spinner
    }
  },
  methods: {
    signIn () {
      this.$store.dispatch('signIn', { email: this.email, password: this.password })
    },
    signInWithProvider (providerName) {
      this.$store.dispatch('signInWithProvider', { providerName })
    }
  },
  watch: {
    signedIn (newVal, oldVal) {
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

  .social-buttons {
    display: flex;
    flex-direction: column;
  }
</style>
