const Queue = require('../../')

const queue = new Queue({
  name: 'ira-delay-job'
})

queue.listen(async (job) => {
  console.log(`received job: `, job.id)
  console.log(`received job data: `, job.data)
})
queue._queue.on('failed', (err) => {
  console.log(err)
})
queue._queue.on('succeeded', () => {
  console.log('succeeded')
})
