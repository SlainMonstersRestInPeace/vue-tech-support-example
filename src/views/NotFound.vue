<template lang="pug">
.error Route not found!
</template>

<script>
export default {
  name: "NotFound",
  props: {
    notFoundUrl: {
      type: String,
      default: null
    }
  },
  created() {
    if (this.notFoundUrl) {
      history.replaceState(history.state, '', this.notFoundUrl)
    }
  }
}
</script>


<style lang="sass" scoped>

</style>