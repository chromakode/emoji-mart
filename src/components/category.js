import React from 'react'
import Emoji from './emoji'

export default class Category extends React.Component {
  componentDidMount() {
    this.container = this.refs.container
    this.label = this.refs.label
    this.parent = this.container.parentNode

    this.margin = 0
    this.minMargin = 0

    this.memoizeSize()
  }

  componentDidUpdate() {
    this.memoizeSize()
  }

  memoizeSize() {
    var { top, height } = this.container.getBoundingClientRect()
    var { top: parentTop } = this.parent.getBoundingClientRect()
    var { height: labelHeight } = this.label.getBoundingClientRect()

    this.top = top - parentTop + this.parent.scrollTop
    this.maxMargin = height - labelHeight
  }

  handleScroll(scrollTop) {
    var margin = scrollTop - this.top
    margin = margin < this.minMargin ? this.minMargin : margin
    margin = margin > this.maxMargin ? this.maxMargin : margin

    if (margin == this.margin) return
    this.label.style.top = `${margin}px`
    this.margin = margin
  }

  render() {
    var { name, emojis, perLine, hasStickyPosition, emojiProps } = this.props,
        emojis = emojis.slice(0),
        lines = [],
        linesCount = Math.ceil(emojis.length / perLine),
        labelStyles = {},
        labelSpanStyles = {}

    Array(linesCount).fill().forEach((_, i) =>
      lines.push(emojis.splice(0, perLine))
    )

    if (!hasStickyPosition) {
      labelStyles = {
        height: 28,
      }

      labelSpanStyles = {
        position: 'absolute',
      }
    }

    return <div ref='container' className='emoji-picker-category'>
      <div style={labelStyles} data-name={name} className='emoji-picker-category-label'>
        <span style={labelSpanStyles} ref='label'>{name}</span>
      </div>

      {lines.map((emojis, i) =>
        <div key={`line-${i}`}>
          {emojis.map((emoji) =>
            <Emoji
              key={emoji}
              emoji={emoji}
              {...emojiProps}
            />
          )}
        </div>
      )}
    </div>
  }
}

Category.propTypes = {
  emojis: React.PropTypes.array,
  hasStickyPosition: React.PropTypes.bool,
  name: React.PropTypes.string.isRequired,
  perLine: React.PropTypes.number.isRequired,
  emojiProps: React.PropTypes.object.isRequired,
}

Category.defaultProps = {
  emojis: [],
  hasStickyPosition: true,
}