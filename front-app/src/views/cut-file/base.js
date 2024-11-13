import FileWorker from './files.worker.js?worker'
import SparkMD5 from 'spark-md5'
export const getConcurrency = () => navigator.hardwareConcurrency || 4 // 浏览器不支持就默认4核
import { uploadFleApi } from '@/api/user'

// 文件切片：使用 JavaScript 的 Blob.prototype.slice() 方法将大文件切分成多个切片。
// 上传切片：使用 axios 或其他 HTTP 客户端库逐个上传切片。可以为每个切片生成一个唯一的标识符（例如，使用文件的哈希值和切片索引），以便后端能够正确地将它们合并。
// 客户端线程数：获取用户CPU线程数量，以便最大优化上传文件速度。
// 控制上传接口的并发数量：防止大量的请求并发导致页面卡死，设计一个线程队列，控制请求数量一直保持在6。

export const sliceFile = (file, chunkSize = 1024 * 1024) => {
  return new Promise((resolve, reject) => {
    const thread = getConcurrency() // 线程数
    const chunks = []
    const chunkNum = Math.ceil(file.size / chunkSize) // 切片总数量

    const workerChunkCount = Math.ceil(chunkNum / thread) // 每个线程需要处理的切片数量

    let finishCount = 0 // 记录已完成的切片数量

    console.log('线程数', thread)
    console.log('切片总数', chunkNum)
    console.log('每个线程需要处理的切片数量', workerChunkCount)

    // 创建一个 Web Worker，用于处理切片上传
    for (let i = 0; i < thread; i++) {
      const worker = new FileWorker()
      // 计算每个线程的开始索引和结束索引
      const startIndex = i * workerChunkCount
      let endIndex = startIndex + workerChunkCount
      if (endIndex > chunkNum) {
        endIndex = chunkNum
      }
      worker.postMessage({
        file,
        chunkSize,
        startIndex,
        endIndex,
      })

      worker.onmessage = (e) => {
        // 接收到 worker 线程返回的消息
        for (let i = startIndex; i < endIndex; i++) {
          chunks[i] = {
            ...e.data[i - startIndex],
            chunkNum,
            filename: file.name,
          }
        }
        worker.terminate() // 关闭线程
        finishCount++
        if (finishCount === thread) {
          // 处理当前文件hash值
          const spark = new SparkMD5.ArrayBuffer()
          for (let i = 0; i < chunks.length; i++) {
            spark.append(chunks[i].fileBuffer)
            delete chunks[i].fileBuffer
          }
          const hash = spark.end()
          const fileHash = file.name + '-' + hash
          for (let i = 0; i < chunks.length; i++) {
            chunks[i].fileHash = fileHash
          }

          // 所有线程都处理完毕，准备上传切片
          resolve(chunks)
        }
      }
    }
  })
}

// 上传切片
export async function uploadChunks(chunks = [], max = 4, callback) {
  console.log('uploadChunks', chunks)
  let curRequestNum = 0
  const queue = []
  const results = []
  const TOTAL_REQUESTS_NUM = chunks.length
  let numberOfRequestsDone = 0
  // 创建一个请求队列
  const request = async (i, item) => {
    if (curRequestNum >= max) {
      await new Promise((resolve) => queue.push(resolve))
    }
    requestItem(i, item)
  }

  const requestItem = async (index, item) => {
    const formData = new FormData()
    console.log('formData', formData)
    Object.keys(item).forEach((key) => {
      formData.append(key, item[key])
    })
    curRequestNum++
    try {
      const result = await uploadFleApi(formData)
      results[index] = result
    } catch (err) {
      results[index] = err
    } finally {
      curRequestNum--
      numberOfRequestsDone++
      if (queue.length) {
        // 每完成一个就从阻塞队列里剔除一个
        queue[0]() // 将最先进入阻塞队列的 Promise 从 Pending 变为 Fulfilled，
        // 也就是执行resolve函数了，后面不就能继续进行了嘛
        queue.shift()
      }
      if (numberOfRequestsDone === TOTAL_REQUESTS_NUM) {
        callback && callback(results)
      }
    }
  }

  for (let i = 0; i < chunks.length; i++) {
    request(i, chunks[i])
  }
}
