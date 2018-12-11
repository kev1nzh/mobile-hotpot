<template>
  <div class="inputNoraml">
    <input :type="type" :placeholder="placeholder"  :maxLength="maxLength"  class="input-noraml" >
  </div>
</template>

<script>
// @ is an alias to /src

export default {
  name: "inputNoraml",
  components: {},
  mounted() {},
  methods: {},
  props: {
    type: {
      type: String
    },
    placeholder: {
      type: String
    },
    maxLength: {
      type: String
    },
    value: Number
  }
};
</script>
<style lang="sass" scoped>
.inputNoraml
  width: 90%;
  margin: 1rem;
  .input-noraml
    // width: 100%;
    // height: 2.5rem;
    // line-height: 2.5rem;
    // border-bottom: 1px solid #E9E9E9;
    // padding-left: 0.75rem;
    // font-size: 24px;
    // color: #4a4a4a;
    width: 100%;
    height: 2.5rem;
    line-height: 2.5rem;
    border-bottom: 1px solid #E9E9E9;
    font-size: 20px;
    box-sizing: border-box;
    padding-left: 0.75rem;
    color: #4a4a4a;
    font-weight: normal;
    outline-offset: 0;
    outline-style: none;
    outline-width: 0;
    -webkit-font-smoothing: inherit;
    background-image: none;
</style>

