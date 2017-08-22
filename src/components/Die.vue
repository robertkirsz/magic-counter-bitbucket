<!--
  Displays results of a die roll
 -->

<template>
  <div class="die">
    <transition
      enter-active-class="fadeInRight"
      leave-active-class="fadeOutLeft"
    >
      <span
        :key="value"
        class="number"
        :class="`number-${value}`"
      >
        <span
          v-for="number in value"
          class="dot"
          :class="`dot-${number}`"
        />
      </span>
    </transition>
  </div>
</template>

<script>
export default {
  name: 'Die',
  props: { value: Number }
}
</script>

<style lang="scss" scoped>
  .die {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    align-self: center;
    position: relative;
    width: 1.5em;
    height: 1.5em;
    background: black;
    border: 0.05em solid white;
    border-radius: 0.15em;
    color: white;
    font-size: 80px;
    overflow: hidden;
    cursor: pointer;
  }

  .number {
    display: flex;
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
  }

  .dot {
    flex: none;
    display: block;
    width: 0.25em;
    height: 0.25em;
    background: white;
    border-radius: 50%;
  }

  .number-1 {
    justify-content: center;
    align-items: center;
  }

  .number-2 {
    flex-direction: column;
    justify-content: space-around;
    .dot {
      margin: 0 0.2em;
    }
    .dot-1 {
      align-self: flex-start;
    }
    .dot-2 {
      align-self: flex-end;
    }
  }

  .number-3 {
    flex-direction: column;
    justify-content: center;
    .dot {
      margin: 0.07em 0.2em;
    }
    .dot-1 {
      align-self: flex-start;
    }
    .dot-2 {
      align-self: center;
    }
    .dot-3 {
      align-self: flex-end;
    }
  }

  .number-4 {
    flex-wrap: wrap;
    justify-content: center;
    align-items: center;
    .dot {
      margin: 0.2em;
    }
  }

  .number-5 {
    flex-wrap: wrap;
    justify-content: space-around;
    align-items: center;
    .dot {
      margin: 0.15em 0em;
    }
    .dot-3 {
      margin: 0 0.5em;
    }
  }

  .number-6 {
    flex-wrap: wrap;
    justify-content: space-around;
    align-items: center;
    .dot {
      margin: 0 0.2em;
    }
  }
</style>
