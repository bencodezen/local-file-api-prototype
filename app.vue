<script setup>
const directoryHandle = ref()
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
  await directoryHandle.value.removeEntry(`${member}.json`)
}

// TODO: Read files from directory and populate data
async function readFiles() {
  const promises = []

  for await (const entry of directoryHandle.value.values()) {
    if (entry.kind !== 'file') {
      continue
    }
    promises.push(
      entry.getFile().then(file => {
        return file.text()
      })
    )
  }

  return await Promise.all(promises)
}

// TODO: Update member info

async function createFile(memberName) {
  const newFileHandle = await directoryHandle.value.getFileHandle(
    `${memberName}.json`,
    { create: true }
  )

  return newFileHandle
}

async function writeFile(fileHandle, contents) {
  const writable = await fileHandle.createWritable()
  await writable.write(contents)
  await writable.close()
}

async function getDirHandle() {
  directoryHandle.value = await window.showDirectoryPicker()
  // Read each file's content
  const files = await readFiles()
  // Push it into the app's data
  files.forEach(file => {
    const { name } = JSON.parse(file)
    crew.value.push(name)
  })
}
</script>

<template>
  <div>
    <h1>One Piece Crew</h1>
    <input type="text" v-model="newMember" @keyup.enter="addMember" />

    <ul>
      <li v-for="(member, index) in crew" :key="`${member}-${index}`">
        {{ member }} - <button @click="deleteMember(member)">🗑️ Delete</button>
      </li>
    </ul>

    <h2>Local File Settings</h2>

    <button @click="getDirHandle">Get Directory</button>
    <p>Directory Handle: {{ directoryHandle }}</p>
  </div>
</template>
