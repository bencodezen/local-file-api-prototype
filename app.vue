<script setup>
const directoryHandle = ref()
const crew = ref([])
const newMember = ref('')

async function addMember() {
  crew.value.push(newMember.value)
  await createFile(newMember.value)
  newMember.value = ''
}

async function createFile(memberName) {
  const newFileHandle = await directoryHandle.value.getFileHandle(
    `${memberName}.json`,
    { create: true }
  )

  return newFileHandle
}

async function getDirHandle() {
  directoryHandle.value = await window.showDirectoryPicker()
  console.log(dirHandle.value)
}
</script>

<template>
  <div>
    <h1>One Piece Crew</h1>
    <input type="text" v-model="newMember" @keyup.enter="addMember" />

    <ul>
      <li v-for="(member, index) in crew" :key="`${member}-${index}`">
        {{ member }}
      </li>
    </ul>

    <h2>Local File Settings</h2>

    <button @click="getDirHandle">Get Directory</button>
    <p>Directory Handle: {{ directoryHandle }}</p>
  </div>
</template>
