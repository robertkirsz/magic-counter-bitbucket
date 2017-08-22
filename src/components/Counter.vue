<!--
  .placeholder - used to keep dimensions of otherwise absolutely positioned element
 -->

<template>
  <transition
    enter-active-class="fadeIn"
    leave-active-class="fadeOut"
  >
    <div
      :class="['counter', `counter--${type}`]"
      :style="style"
    >
      <span v-if="showLabel" class="label">
        {{ label }}
      </span>
      <counter-button
        icon="fa fa-minus"
        @click="minusClick"
      />
      <div class="count" :class="{ moreThan100: moreThan100 }">
        <transition
          :enter-active-class="enterClass"
          :leave-active-class="leaveClass"
        >
          <span class="value" :key="value">
            {{ value }}
          </span>
        </transition>
        <span class="placeholder">
          {{ value }}
        </span>
      </div>
      <counter-button
        icon="fa fa-plus"
        @click="plusClick"
      />
    </div>
  </transition>
</template>

<script>
import { mapGetters } from 'vuex'
import CounterButton from '@/components/CounterButton'

export default {
  name: 'Counter',
  components: { CounterButton },
  props: {
    value: { type: Number, required: true },
    type: { type: String, required: true },
    label: { type: Number },
    animated: { type: Boolean, default: false }
  },
  data () {
    return {
      animationDirection: ''
    }
  },
  computed: {
    ...mapGetters([
      'numberOfPlayers',
      'divider',
      'commanderGame'
    ]),
    style () {
      if (this.type === 'life') return false
      return {
        fontSize: `${10 / this.divider}vmax`
      }
    },
    enterClass () {
      return this.animated ? `fadeIn${this.animationDirection}` : ''
    },
    leaveClass () {
      return this.animated ? `fadeOut${this.animationDirection}` : ''
    },
    showLabel () {
      return this.commanderGame && this.numberOfPlayers > 2 && this.label !== undefined
    },
    moreThan100 () {
      return this.value > 99
    }
  },
  methods: {
    minusClick () {
      this.$emit('minusClick')
    },
    plusClick () {
      this.$emit('plusClick')
    }
  },
  watch: {
    value (newVal, oldVal) {
      if (newVal > oldVal && this.animated) {
        this.animationDirection = 'Up'
      }
      if (newVal < oldVal && this.animated) {
        this.animationDirection = 'Down'
      }
    }
  }
}
</script>

<style lang="scss" scoped>
  // BASE

  .counter {
    display: flex;
    flex-wrap: nowrap;
    justify-content: space-around;
    align-items: center;
    position: relative;
    font-size: 1em;
    .label {
      position: absolute;
      top: -0.9em;
      left: 50%;
      font-size: 0.4em;
      transform: translateX(-50%);
    }
    .count {
      position: relative;
      transition: font-size 0.3s;
      &.moreThan100 {
        font-size: 6.3em;
      }
      .placeholder {
        opacity: 0;
      }
      .value {
        position: absolute;
        top: 0;
        right: 0;
        bottom: 0;
        left: 0;
        text-align: center;
      }
    }
  }

  // MODIFIERS

  .counter--life {
    max-height: 50vh;
    font-size: 7em;
    @media (max-width: 420px) {
      font-size: 9em;
    }
  }

  .counter--poison,
  .counter--commander {
    margin-top: 1rem;
    padding: 0.1em;
    font-weight: 800;
    z-index: 1;
    .count {
      font-size: 0.6em;
    }
    .counter-buttons {
      padding: 0.3em 0.5em;
    }
    &::after {
      content: "";
      position: absolute;
      top: 0;
      right: 0;
      bottom: 0;
      left: 0;
      background-repeat: no-repeat;
      background-size: contain;
      opacity: 0.25;
      z-index: -1;
    }
  }

  .counter--poison {
  	&::after {
      top: -10px;
      right: -10px;
      bottom: -10px;
      left: -10px;
  		background-image: url("../assets/poison.svg");
  		background-position: 50% 50%;
  	}
  }

  .counter--commander {
  	&::after {
  		background-image: url("../assets/commander.svg");
  		background-position: 50% 35%;
  	}
  }
</style>
