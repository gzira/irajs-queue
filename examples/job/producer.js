const Queue = require('../../')

const queue = new Queue({
  name: 'ira-job'
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
