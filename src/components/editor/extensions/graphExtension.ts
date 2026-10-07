import { Node, mergeAttributes } from '@tiptap/core';
import { ReactNodeViewRenderer } from '@tiptap/react';
import GraphNodeView from '../nodes/GraphNodeView';

export const GraphExtension = Node.create({
  name: 'graph',
  group: 'block',
  atom: true,
  draggable: true,

  addAttributes() {
    return {
      title: {
        default: "Ohm's Law: Voltage vs Current (V = IR)",
      },
      graphType: {
        default: 'line', // 'line' | 'scatter' | 'bar'
      },
      xLabel: {
        default: 'Current',
      },
      yLabel: {
        default: 'Voltage',
      },
      xUnit: {
        default: 'A (Amperes)',
      },
      yUnit: {
        default: 'V (Volts)',
      },
      showGrid: {
        default: true,
      },
      showBestFit: {
        default: true,
      },
      datasets: {
        default: [
          {
            name: 'Observed Data',
            color: '#006fcc',
            data: [
              { x: 0.1, y: 0.5 },
              { x: 0.2, y: 1.0 },
              { x: 0.3, y: 1.5 },
              { x: 0.4, y: 2.0 },
              { x: 0.5, y: 2.5 },
            ],
          },
        ],
      },
    };
  },

  parseHTML() {
    return [
      {
        tag: 'div[data-type="graph"]',
        getAttrs: (element) => {
          if (typeof element === 'string') return {};
          try {
            const rawData = element.getAttribute('data-datasets');
            return {
              title: element.getAttribute('data-title') || "Ohm's Law",
              graphType: element.getAttribute('data-graph-type') || 'line',
              xLabel: element.getAttribute('data-x-label') || 'X',
              yLabel: element.getAttribute('data-y-label') || 'Y',
              xUnit: element.getAttribute('data-x-unit') || '',
              yUnit: element.getAttribute('data-y-unit') || '',
              showGrid: element.getAttribute('data-show-grid') !== 'false',
              showBestFit: element.getAttribute('data-show-best-fit') !== 'false',
              datasets: rawData ? JSON.parse(rawData) : [],
            };
          } catch {
            return {};
          }
        },
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    return [
      'div',
      mergeAttributes(HTMLAttributes, {
        'data-type': 'graph',
        'data-title': HTMLAttributes.title,
        'data-graph-type': HTMLAttributes.graphType,
        'data-x-label': HTMLAttributes.xLabel,
        'data-y-label': HTMLAttributes.yLabel,
        'data-x-unit': HTMLAttributes.xUnit,
        'data-y-unit': HTMLAttributes.yUnit,
        'data-datasets': JSON.stringify(HTMLAttributes.datasets || []),
        class: 'scientific-interactive-graph-block my-4 select-none',
      }),
    ];
  },

  addNodeView() {
    return ReactNodeViewRenderer(GraphNodeView);
  },
});
