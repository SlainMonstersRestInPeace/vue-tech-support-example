<template lang="pug">
.d-flex.flex-row.justify-content-center
  nav
    ul(class="pagination")
      li.page-item(v-if="totalPages > 1")
        router-link.page-link(:to="`/tickets/?page=${page}`" v-if="page > 0") &lt;
        router-link.page-link(:to="currentPath" v-else) &lt;
      li.page-item(v-if="totalPages > 1" v-for="(n, i) in pages" :class="{active: page === lowerPage + i}")
        router-link.page-link(:to="`/tickets/?page=${lowerPage + n}`") {{lowerPage + n}}
      li.page-item(v-if="totalPages > 1")
        router-link.page-link(:to="`/tickets/?page=${page + 1 + 1}`" v-if="page < totalPages - 1") &gt;
        router-link.page-link(:to="currentPath" v-else) &gt;
</template>

<script>

const PAGES_EITHER_SIDE = 4;
const MAX_PAGES = PAGES_EITHER_SIDE * 2 + 1;

export default {
  name:"Pagination",
  props: {
    page: {
      type: Number,
      default: 0
    },
    itemsPerPage: {
      type: Number,
      default: 0
    },
    totalPages: {
      type: Number,
      default: 0,
    },
  },
  data() {
    return {
      PAGES_EITHER_SIDE
    }
  },
  computed: {
    currentPath() {
      return this.$route.fullPath;
    },
    pages() {
      return Math.min(MAX_PAGES, this.totalPages);
    },
    upperPage() {
      return Math.min(this.page + PAGES_EITHER_SIDE, this.totalPages - 1);
    },
    lowerPage() {
      const minLower = Math.max(this.page - PAGES_EITHER_SIDE, 0);
      const maxLower = Math.max(0, Math.min(minLower, this.totalPages - MAX_PAGES));

      return maxLower;
    },
  },
  methods: []
}
</script>

<style scoped lang="scss">
li a {
  width: 50px;
  text-align: center;
}
</style>