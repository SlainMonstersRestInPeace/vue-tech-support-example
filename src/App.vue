<template lang="pug">
.container
  .row.no-gutters
    .col-8.left.p-2
      router-view
    .col-4.right
      Navigation
  //- .row
    hr.col
</template>

<script>
import Navigation from './components/Navigation'

export default {
  components: {
    Navigation
  }
}
</script>


<style lang="scss" scoped>
.left {
  background: #FAFAFA;
}

.right {
  background: #6D7FCC;
}

</style>
