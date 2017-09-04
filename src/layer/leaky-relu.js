'use strict';

import BaseLayer from './base';
import makeKernel from '../utilities/make-kernel';
import { activate, derivative } from '../activation/leaky-relu';

export default class LeakyReluLayer extends BaseLayer {
  setupKernels() {
    this.predictKernel = makeKernel(function(inputs) {
      return activate(inputs[this.thread.y][this.thread.x]);
    }, {
      functions: [activate]
    });

    this.learnKernel = makeKernel(function(weights, deltas) {
      return derivative(weights[this.thread.y][this.thread.x], deltas[this.thread.y][this.thread.x]);
    }, {
      functions: [derivative]
    });
  }

  predict() {
    this.outputs = this.predictKernel(this.inputs);
  }

  learn() {
    this.deltas = this.learnKernel(this.weights, this.deltas);
  }
}