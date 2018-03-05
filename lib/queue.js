const Bee = require('bee-queue')
const moment = require('moment')

const defOpts = {
  prefix: 'bq',
  stallInterval: 5000,
  nearTermWindow: 1200000,
  delayedDebounce: 1000,
  // redis opts & redis instance
  redis: {
    host: '127.0.0.1',
    port: 6379,
    db: 0,
    options: {}
  },
  isWorker: true,
  getEvents: true,
  sendEvents: true,
  storeJobs: true,
  ensureScripts: true,
  // activateDelayedJobs: false,
  activateDelayedJobs: true,
  removeOnSuccess: false,
  removeOnFailure: false,
  redisScanCount: 100
}

class Queue {
  /**
   * @param {Object} opts name: String, delayUntil: Date|timestamp|number
   * @param {Object} beeOpts
   */
  constructor (opts, beeOpts = {}) {
    if (!opts.name) throw new Error('need queue name')
    if (opts.delayUntil) {
      opts.delayUntil = this._validTime(opts.delayUntil)
    }
    this.opts = Object.assign({
      // 默认开启 retry 机制，并且 retry 次数为 6，时间 1s, 下次 *2
      retry: {
        count: 6,
        strategy: 'exponential',
        delay: 1000
      },
      delayUntil: null
    }, opts)
    this._queue = new Bee(opts.name, Object.assign(defOpts, beeOpts))
    this.logger = console.log
    this.ready()
  }
  /**
   * 发送数据
   * @param {Object} data
   * @param {Object} opts retry: Objcect, delayUntil: timestamp
   */
  async send (data, opts = {}) {
    let {retry} = this.opts
    let delayUntil = opts.delayUntil || this.opts.delayUntil
    delayUntil = this._validTime(delayUntil)
    const job = this._queue.createJob(data)
    if (retry) {
      job.retries(retry.count)
      job.backoff(retry.strategy, retry.delay)
    }
    if (delayUntil) {
      this.logger('info', `delayJob startWith: ${moment(delayUntil)}`)
      job.delayUntil(delayUntil)
    }
    if (opts.id) {
      job.setId(opts.id)
    }
    await job.save()
    return job
  }
  /**
   * 处理
   * @param {generatorFn} fns
   */
  async listen (...fns) {
    const queue = this._queue
    queue.process(async (job) => {
      let idx = 1
      for (let fn of fns) {
        await fn(job)
        job.reportProgress(Math.round(idx / fns.length * 100))
        idx++
      }
    })
  }

  ready () {
    this._queue.on('ready', () => {
      this.logger('info', `queue: ${this.opts.name} is  ready`)
    })
  }
  _validTime (delayUntil) {
    if (delayUntil <= 24 * 60 * 60) {
      delayUntil = moment().add(delayUntil, 'ms').valueOf()
    } else {
      if (moment(delayUntil).valueOf() < moment().valueOf()) {
        throw new Error('delayUntil 时间无效')
      }
    }
    return delayUntil
  }
}

module.exports = Queue

