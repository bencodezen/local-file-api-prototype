<script setup lang="ts">
const { readFile } = useFileSystemAPI()

const route = useRoute()
const { getFileHandle, writeFile } = useFileSystemAPI()

const memberName = computed(() => route.params.member)
const memberInfo = ref({})

async function deleteSpecialMove(move) {
  memberInfo.value.specialMoves = memberInfo.value.specialMoves.filter(
    m => m !== move
  )

  await writeFile(
    await getFileHandle(`${memberName.value}.json`),
    JSON.stringify(memberInfo.value)
  )
}

onMounted(async () => {
  const details = await readFile(memberName.value)
  memberInfo.value = {
    ...JSON.parse(details)
  }
})
</script>

<template>
  <h1>{{ memberName }} Page</h1>
  <h2>Special Moves</h2>
  <ul v-if="memberInfo.specialMoves">
    <li
      v-for="(move, index) in memberInfo.specialMoves"
      :key="`special-move-${index}`"
    >
      {{ move }} - <button @click="deleteSpecialMove(move)">🗑️ Delete</button>
    </li>
  </ul>
  <h2>Raw Data</h2>
  <pre>{{ memberInfo }}</pre>
</template>

<style lang="scss" scoped></style>
