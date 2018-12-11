<template>
  <div class="inputClick">
    <div class="input-click" @click="handleClick"><slot></slot></div>
  </div>
</template>

<script>
// @ is an alias to /src

export default {
  name: "inputClick",
  components: {},
  mounted() {},
  methods: {
    handleClick(evt) {
      this.$emit('click', evt);
    }
  }
};
</script>
<style lang="sass" scoped>
.inputClick
  width: 90%;
  margin: 1rem;
  .input-click
    background: #E3C48A;
    width: 100%;
    height: 2.5rem;
    line-height: 2.5rem;
    border-bottom: 1px solid #E9E9E9;
    font-size: 16px;
    box-sizing: border-box;
    text-align: center;
    color: #8C6500;
    font-weight: normal;
    outline-offset: 0;
    outline-style: none;
    outline-width: 0;
    -webkit-font-smoothing: inherit;
    background-image: none;
    // opacity: 0.4;

</style>
