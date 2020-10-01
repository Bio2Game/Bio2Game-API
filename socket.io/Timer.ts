import Timeout = NodeJS.Timeout

export default class Timer {
  public time: number
  public timeout: Timeout
  public startDate: number
  public resolve: any
  public timeLeftAtPause: number

  constructor (time: number) {
    this.time = time
  }

  public start () {
    return new Promise(resolve => {
      this.resolve = resolve
      this.startDate = Date.now()

      this.timeout = setTimeout(resolve, this.time)
    })
  }

  public getCurrentTime () {
    return this.startDate ? Date.now() - this.startDate : 0
  }

  public getTimeLeft () {
    return this.time - this.getCurrentTime()
  }

  public pause () {
    clearTimeout(this.timeout)
    this.timeLeftAtPause = this.time - (Date.now() - this.startDate)
  }

  public resume () {
    this.timeout = setTimeout(this.resolve, this.timeLeftAtPause)
    this.startDate = Date.now() - (this.time - this.timeLeftAtPause)
  }

  public stop () {
    clearTimeout(this.timeout)
    this.resolve()
  }

  public serialize () {
    return {
      timeLeft: this.getTimeLeft(),
      current: this.getCurrentTime(),
      timeTotal: this.time,
    }
  }
}
