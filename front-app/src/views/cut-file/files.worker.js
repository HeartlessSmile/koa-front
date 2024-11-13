import SparkMD5 from 'spark-md5'
self.onmessage = async function (e) {
  const { file, chunkSize, startIndex, endIndex } = e.data
  const arr = []
  for (let i = startIndex; i < endIndex; i++) {
    arr.push(createChunks(file, i, chunkSize))
  }
  const chunks = await Promise.all(arr)
  postMessage(chunks)
}

const createChunks = (file, index, chunkSize) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    const spark = new SparkMD5.ArrayBuffer()
    const start = index * chunkSize
    const end = Math.min(start + chunkSize, file.size)
    const files = file.slice(start, end)
    reader.onload = (e) => {
      spark.append(e.target.result)
      const md5 = spark.end()
      resolve({ start, end, md5, files, index, md5, fileBuffer: e.target.result })
    }

    reader.onerror = (error) => {
      reject(error)
    }

    reader.readAsArrayBuffer(files)
  })
}

self.onerror = function (e) {
  self.close()
}
