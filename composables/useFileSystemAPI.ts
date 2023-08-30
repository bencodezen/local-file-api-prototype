export const useFileSystemAPI = () => {
  const directoryHandle = ref(null)

  async function createFile(memberName) {
    const newFileHandle = await directoryHandle.value.getFileHandle(
      `${memberName}.json`,
      { create: true }
    )

    return newFileHandle
  }

  async function getDirectoryHandle() {
    directoryHandle.value = await window.showDirectoryPicker()
  }

  async function readFile(memberName: string) {
    const fileHandle = await directoryHandle.value.getFileHandle(
      `${memberName}.json`
    )
    return fileHandle.getFile().then(file => {
      return file.text()
    })
  }

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

  async function writeFile(fileHandle, contents) {
    const writable = await fileHandle.createWritable()
    await writable.write(contents)
    await writable.close()
  }

  return {
    directoryHandle,
    createFile,
    getDirectoryHandle,
    readFile,
    readFiles,
    writeFile
  }
}
