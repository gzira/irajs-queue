const Queue = require('../../')

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
  throw new Error('test retry')
})
