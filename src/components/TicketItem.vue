<template lang="pug">
router-link.text-dark.mr-auto.d-flex.flex-row(:to="{name: 'ViewTicket', params: {id: ticket.id}}")
  h5.d-flex.justify-content-between.w-100
    span.ticket-title {{ticket.title}}
    span.badge.text-white(:class="badgeBackground") {{ticket.status}}
p.ticket-description.m-0.overflow-hidden {{ticket.description}}
</template>

<script>
import uuid from '../mixins/uuid'

export default {
  mixins: [uuid],
  props: {
    ticket: {
      type: Object,
      default: () => ({})
    },
  },
  computed: {
    badgeBackground() {
      return {
        'bg-danger': this.ticket.status === 'active',
        'bg-success': this.ticket.status === 'resolved',
      }
    }
  },
}
</script>

<style lang="scss" scoped>
a {
  text-decoration: none
}

.ticket-description {
  max-height: 48px;
  line-height: 24px;
  color: #7b7b7b;
  overflow-wrap: anywhere;
}

</style>

