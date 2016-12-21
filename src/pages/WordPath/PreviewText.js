
import React, {Component} from 'react';
import {css, StyleSheet} from 'aphrodite'

export default class PreviewText extends Component {
  shouldComponentUpdate(nextProps) {
    return nextProps.walked !== this.props.walked
  }
  render() {
    const {matrix, walked} = this.props

    let text = ''
    const nwalked = walked.length
    for (let i=0; i<nwalked; i++) {
      text += matrix[walked[i][0]][walked[i][1]]
    }

    return <div className={css(styles.formed)}>
      {text[0] + text.slice(1).toLowerCase()}
    </div>
  }
}

const styles = StyleSheet.create({

  formed: {
    padding: 10,
    flex: 1,
    overflow: 'auto',
    lineHeight: 1.5,
  },

})
