<script setup>
import { useFileSystemAPI } from '../composables/useFileSystemAPI'

const {
  checkPermission,
  createFile,
  directoryHandle,
  getDirectoryHandle,
  readFiles,
  writeFile
} = useFileSystemAPI()

const crew = ref([])
const newMember = ref('')

async function addMember() {
  crew.value.push(newMember.value)
  const fileHandle = await createFile(newMember.value)
  await writeFile(fileHandle, JSON.stringify({ name: newMember.value }))
  newMember.value = ''
}

async function deleteMember(member) {
  crew.value = crew.value.filter(m => m !== member)
  // TODO: Refactor this to a utility function
  await directoryHandle.value.removeEntry(`${member}.json`)
}

// TODO: Update member info
async function selectDirectory() {
  await getDirectoryHandle()
  // Read each file's content
  const files = await readFiles()
  // Push it into the app's data
  files.forEach(file => {
    const { name } = JSON.parse(file)
    crew.value.push(name)
  })
}

onMounted(async () => {
  await checkPermission()
  // Read each file's content
  const files = await readFiles()
  // Push it into the app's data
  files.forEach(file => {
    const { name } = JSON.parse(file)
    crew.value.push(name)
  })
})
</script>

<template>
  <div>
    <h1>One Piece Crew</h1>
    <input type="text" v-model="newMember" @keyup.enter="addMember" />

    <ul>
      <li v-for="(member, index) in crew" :key="`${member}-${index}`">
        <NuxtLink :to="`/crew/${member}`">{{ member }}</NuxtLink> -
        <button @click="deleteMember(member)">🗑️ Delete</button>
      </li>
    </ul>

    <h2>Local File Settings</h2>

    <button @click="selectDirectory">Get Directory</button>
    <p>Directory Handle: {{ directoryHandle }}</p>
  </div>
</template>
