<script setup lang="ts">
const route = useRoute()

const memberName = computed(() => route.params.member)
</script>

<template>
  <h1>{{ memberName }} Page</h1>
</template>

<style lang="scss" scoped></style>
