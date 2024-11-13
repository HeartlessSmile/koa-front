<template>
  <h1>批量请求数据，并控制请求并发数量</h1>
  <el-button @click="setMoreRequest(4)">send</el-button>
</template>

<script setup>
import { reactive, ref, onMounted } from 'vue'
import { getTest } from '@/api/user'
const list = new Array(20).fill('')
//  申明队列
let queue = []
// const setMoreRequest = () => {
//   for (let i = 0; i < list.length; i++) {
//     queue.push(i)
//   }
//   dequeue()
// }

const setMoreRequest = () => {
  sendRequest_more(list, 8, () => {
    console.log('完成')
  })
}

let serveNum = 0

const dequeue = () => {
  let max = 8
  serveNum--
  if (serveNum < 0) {
    serveNum = 0
  }

  while (queue.length > 0) {
    if (serveNum >= max) {
      return false
    }
    let cur = queue.shift()
    serveNum++
    sendRequest(cur)
  }
}

const sendRequest = (id) => {
  getTest({ id })
    .then((res) => {
      console.log(res)
    })
    .catch((err) => {
      console.log(err)
    })
    .finally(() => {
      dequeue()
    })
}

// 实现批量请求数据，并控制请求并发数量，最后所有请求结束之后，执行callback回调函数
const sendRequest_more = (urlList, max, callback) => {
  const REQUEST_MAX = max
  const TOTAL_REQUESTS_NUM = urlList.length
  const blockQueue = [] // 等待排队的那个队列
  let currentReqNumber = 0 // 现在请求的数量是
  let numberOfRequestsDone = 0 // 已经请求完毕的数量是
  const results = new Array(TOTAL_REQUESTS_NUM).fill(false) // 所有请求的返回结果，先初始化上

  async function init() {
    for (let i = 0; i < urlList.length; i++) {
      request(i, urlList[i])
    }
  }

  async function request(index, reqUrl) {
    // 这个index传过来就是为了对应好哪个请求，
    // 放在对应的results数组对应位置上的，保持顺序
    if (currentReqNumber >= REQUEST_MAX) {
      await new Promise((resolve) => blockQueue.push(resolve)) // 阻塞队列增加一个 Pending 状态的 Promise，
      // 进里面排队去吧，不放你出来，不resolve你，你就别想进行下面的请求
    }
    reqHandler(index, reqUrl) // {4}
  }

  async function reqHandler(index, reqUrl) {
    currentReqNumber++ // {5}
    try {
      const result = await getTest({ index })
      results[index] = result
    } catch (err) {
      results[index] = err
    } finally {
      currentReqNumber--
      numberOfRequestsDone++
      if (blockQueue.length) {
        // 每完成一个就从阻塞队列里剔除一个
        blockQueue[0]() // 将最先进入阻塞队列的 Promise 从 Pending 变为 Fulfilled，
        // 也就是执行resolve函数了，后面不就能继续进行了嘛
        blockQueue.shift()
      }
      if (numberOfRequestsDone === TOTAL_REQUESTS_NUM) {
        callback(results)
      }
    }
  }

  init()
}

onMounted(() => {})
</script>

<style lang="scss" scoped></style>
