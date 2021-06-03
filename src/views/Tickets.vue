<template lang="pug">
SearchTicket(@apply-filter="applyFilter")
ul.list-group.mb-3(v-if="tickets.length > 0")
  li.list-group-item(:key="uuid()" v-for="ticket in paginatedTickets")
    TicketItem(:ticket="ticket")
div(v-else) No items for displaying!
Pagination(:page="pageNumber" :totalPages="totalPages" :itemsPerPage="ITEMS_PER_PAGE")
</template>

<script>
import uuid from '../mixins/uuid'

import SearchTicket from '../components/SearchTicket'
import TicketItem from '../components/TicketItem'
import Pagination from '../components/Pagination'


const ITEMS_PER_PAGE = 10;

export default {
  name: 'Tickets',
  components: {
    TicketItem,
    Pagination,
    SearchTicket
  },
  mixins: [uuid],
  beforeRouteLeave(to, from, next) {
    this.$store.commit('setPreviousRoute', from);

    next();
  },
  props: {
    page: {
      type: [Number, String],
      default: 0
    },
    previousUrl: {
      type: String,
      default: null
    }
  },
  data() {
    return {
      ITEMS_PER_PAGE
    }
  },
  computed: {
    pageNumber() {
      if (isNaN(this.page)) {
        return 0;
      }

      return this.page;
    },
    tickets() {
      return this.$store.getters.filteredTickets;
    },
    totalItems() {
      if (this.$store.state.tickets) {
        return this.tickets.length;
      }

      return 0;
    },
    totalPages() {
      return Math.ceil(this.totalItems / ITEMS_PER_PAGE);
    },
    paginatedTickets() {
      return this.tickets.slice(this.pageNumber * ITEMS_PER_PAGE, (this.pageNumber + 1) * ITEMS_PER_PAGE);
    }
  },
  watch: {
    page() {
      if (!this.validatePage()) {
        this.$router.push({ name: 'Tickets', params: { page: 0 } });
      }

      if (this.previousUrl) {
        history.replaceState(history.state, '', this.previousUrl);
      }
    }
  },
  async created() {
    if (!this.$store.state.tickets) {
      await this.$store.dispatch('fetchTickets');
    }

    if (!this.validatePage()) {
      this.$router.push({ name: 'Tickets', params: { page: 0 } });
    }
  },
  methods: {
    validatePage() {
      const page = +this.page;

      return !isNaN(page) && page >= 0 && page <= this.totalPages - 1;
    },
    applyFilter(filters) {
      this.$store.commit('setFilters', filters);
      this.$router.push({ name: 'Tickets', params: { page: 0 } });
    }
  }
}
</script>

<style lang="scss" scoped>

</style>