/**
 * Created by axetroy on 17-4-6.
 */
import React, { Component } from 'react';
import ChartJs from 'chart.js';
import debounce from 'lodash.debounce';
import isequal from 'lodash.isequal';

class Chart extends Component {
  componentDidUnmounted() {
    this.__chart__ && this.__chart__.destroy && this.__chart__.destroy();
  }

  shouldComponentUpdate(nextProps) {
    return !isequal(this.props, nextProps);
  }

  draw(ctx) {
    if (!ctx) return;

    const config = {
      type: this.props.type,
      data: { ...this.props.data },
      options: { ...this.props.options }
    };

    this.__chart__ = new ChartJs(ctx, config);
  }

  render() {
    return (
      <canvas
        width={this.props.width}
        height={this.props.height}
        ref={debounce(ctx => this.draw(ctx), 500)}
      />
    );
  }
}

export default Chart;
