<script setup lang="ts">
const { readFile } = useFileSystemAPI()

const route = useRoute()
const { getFileHandle, writeFile } = useFileSystemAPI()

const memberName = computed(() => route.params.member)
const memberInfo = ref({})
const newSpecialMove = ref('')

async function writeMemberFile(memberName) {
  await writeFile(
    await getFileHandle(`${memberName}.json`),
    JSON.stringify(memberInfo.value)
  )
}

async function addSpecialMove() {
  // This syntax is called nullish coalescing assignment
  memberInfo.value.specialMoves ??= []

  memberInfo.value.specialMoves.push(newSpecialMove.value)

  await writeMemberFile(memberName.value)

  newSpecialMove.value = ''
}

async function deleteSpecialMove(move) {
  memberInfo.value.specialMoves = memberInfo.value.specialMoves.filter(
    m => m !== move
  )

  await writeMemberFile(memberName.value)
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
  <input v-model="newSpecialMove" type="text" @keyup.enter="addSpecialMove" />
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
