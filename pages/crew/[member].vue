<script setup lang="ts">
const { readFile } = useFileSystemAPI()

const route = useRoute()

const memberName = computed(() => route.params.member)
const memberInfo = ref({})

onMounted(async () => {
  const details = await readFile(memberName.value)
  memberInfo.value = {
    ...JSON.parse(details)
  }
})
</script>

<template>
  <h1>{{ memberName }} Page</h1>
  <pre>{{ memberInfo }}</pre>
</template>

<style lang="scss" scoped></style>
