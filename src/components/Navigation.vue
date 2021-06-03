<template lang="pug">
nav
  ul.list-unstyled.m-0
    li
      router-link(to="/report") Report issue
    li
      router-link(to="/tickets") Issues
  hr.m-0
  router-view(name="ticket-link")
  router-view(name="not-found")
</template>

<script>
export default {
  name: "Navigation"
}
</script>

<style scoped lang="scss">
a {
  text-decoration: none;
  display: block;

  color: #FAFAFA;
  background: #7386D5;
  transition: 0.2s ease-out all;
  padding: 12px;
}

a:hover {
  color: #7386D5;
  background: white;
}
</style>