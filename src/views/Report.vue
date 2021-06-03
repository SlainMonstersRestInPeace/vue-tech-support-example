<template lang="pug">
CreateTicket(@create-ticket="createTicket")
</template>

<script>
import CreateTicket from '../components/CreateTicket'

export default {
  name: 'Report',
  components: {
    CreateTicket
  },
  beforeRouteLeave(to, from, next) {
    this.$store.commit('setPreviousRoute', from);

    next();
  },
  computed: {
    backRoute() {
      return this.$store.state.previousRoute || { name: 'Tickets', params: { page: 0 } };
    },
  },
  created() {
    if (!this.$store.state.tickets) {
      this.$store.dispatch('fetchTickets');
    }
  },
  methods: {
    createTicket(ticket) {
      this.$store.dispatch('createTicket', ticket);
    }
  }
}
</script>

<style lang="scss" scoped>

</style>