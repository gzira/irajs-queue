# irajs-queue

基于 [bee-queue](https://github.com/bee-queue/bee-queue) 封装一个简单的业务场景

## 快速开始
```bash
npm i irajs-queue
```

## Queue(opts, beeOpts)

### opts
- name: 必填, 队列名称
- delayUntil: number | date | timestamp: 选填，只用于延时任务或定时任务
- retry: Object, 重试机制，默认是 6 次，每次 1s * 2 递增。

## queue 实例化
- async send(data, opts)
  - data: 数据, Object
  - opts: retry: {}, id: string, delayUntil: 覆盖默认的 delayUntil

- async listen (...generatorFn)

```javascript
const Queue = require('irajs-queue')

const queue = new Queue({
  name: 'ira-one-job'
})

const data = {
  x: 'foo',
  y: 'bar'
}

const send = async () => {
  await queue.send(data)
  console.log(`job has saved`)
}

send()

queue.listen(async (job) => {
  console.log(`received job: `, job.id)
  console.log(`received job data: `, job.data)
})
```

PS. 参考 examples 三个例子，普通任务、定时或延时任务

## LICENSE
MIT