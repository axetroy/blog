/**
 * Created by axetroy on 17-4-6.
 */
import React, { Component } from 'react';
import ChartJs from 'chart.js';

class Chart extends Component {
  componentDidUnmounted() {
    this.__chart__ && this.__chart__.destroy && this.__chart__.destroy();
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
      <div>
        <canvas
          width={this.props.width}
          height={this.props.height}
          ref={ctx => this.draw(ctx)}
        />
      </div>
    );
  }
}

export default Chart;
