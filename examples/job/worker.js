const Queue = require('../../')

const queue = new Queue({
  name: 'ira-job'
})

queue.listen(async (job) => {
  console.log(`received job: `, job.id)
  console.log(`received job data: `, job.data)
})
