const Queue = require('../../')

const queue = new Queue({
  name: 'ira-delay-job',
  delayUntil: 3000
}, { isWorker: false })

const data = {
  x: 'foo',
  y: 'bar'
}

const send = async () => {
  await queue.send(data)
  console.log(`job has saved`)
}

send()
