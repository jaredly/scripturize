
import React, {Component} from 'react'

const timeDiff = dd => {
  const secs = (dd/1000)|0
  let s = secs % 60
  if (s < 10) s = '0' + s
  const mins = (secs / 60)|0
  let m = mins % 60
  if (mins < 60) return m + ':' + s
  if (m < 10) m = '0' + m
  const h = (mins / 60)|0
  return `${h}:${m}:${s}`
}

export default class Timer extends Component {
  constructor(){
    super()
    this.state = {tick: 0}
  }
  componentDidMount(){
    if (!this.props.end) {
      this._tick = setInterval(() => this.setState({tick: 0}), 100)
    }
  }
  componentDidUpdate(prevProps) {
    if (this.props.end) {
      clearInterval(this._tick)
    } else if (prevProps.end) {
      this._tick = setInterval(() => this.setState({tick: 0}), 100)
    }
  }
  componentWillUnmount() {
    clearInterval(this._tick)
  }
  render() {
    return <div className={this.props.className}>
      {timeDiff((this.props.end || Date.now()) - this.props.start)}
    </div>
  }
}
