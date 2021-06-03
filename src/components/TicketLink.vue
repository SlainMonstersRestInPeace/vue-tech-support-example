<template lang="pug">
a(href="#") ticket/{{id || 'error'}}
</template>

<script>
export default {
  name: "TicketLink",
  props: {
    id: {
      type: Number,
      default: 0
    }
  }
}
</script>

<style scoped lang="scss">

</style>