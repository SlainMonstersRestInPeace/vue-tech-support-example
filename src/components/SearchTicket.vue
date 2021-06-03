<template lang="pug">
form.mb-3(action="" @submit.prevent="$emit('apply-filter', filters)")
  .d-flex.flex-row
    .d-flex.flex-row.align-items-center.mr-2
      label.mb-0.mr-2(for="title") Title:
      input.form-control#title(type="text" placeholder="type something..." v-model="filters.title" name="title")
    .d-flex.flex-row.align-items-center.mr-2
      label.mb-0.mr-2(for="description") Description:
      input.form-control#description(type="text" placeholder="type something..." v-model="filters.description" name="description")
    button.btn.btn-primary(type="submit") Apply filter
  .d-flex.flex-row.mt-2
    .form-check.mr-2
      input.form-check-input#active(type="checkbox" v-model="filters.active" name="active")
      label.form-check-label(for="active") active
    .form-check
      input.form-check-input#resolved(type="checkbox" v-model="filters.resolved" name="resolved")
      label.form-check-label(for="resolved") resolved
</template>

<script>
export default {
  name: "SearchTicket",
  emits: ['apply-filter'],
  data() {
    return {
      filters: {
        title: '',
        description: '',
        active: true,
        resolved: true
      }
    }
  },
  created() {
    this.filters = { ...this.$store.state.filters };
  },
}
</script>

<style scoped lang="scss">

</style>