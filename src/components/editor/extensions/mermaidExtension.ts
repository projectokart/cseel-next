import { Node, mergeAttributes } from '@tiptap/core';
import { ReactNodeViewRenderer } from '@tiptap/react';
import MermaidNodeView from '../nodes/MermaidNodeView';

export const MermaidExtension = Node.create({
  name: 'mermaid',
  group: 'block',
  atom: true,
  draggable: true,

  addAttributes() {
    return {
      code: {
        default: `flowchart TD\n  A[Start Scientific Experiment] --> B[Connect Voltage Source]\n  B --> C[Record Multimeter Current]\n  C --> D{Verify V = IR}\n  D -- Yes --> E[Experiment Validated]\n  D -- No --> F[Calibrate Rheostat]`,
      },
    };
  },

  parseHTML() {
    return [
      {
        tag: 'div[data-type="mermaid"]',
        getAttrs: (element) => {
          if (typeof element === 'string') return {};
          return {
            code: element.getAttribute('data-code') || '',
          };
        },
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    return [
      'div',
      mergeAttributes(HTMLAttributes, {
        'data-type': 'mermaid',
        'data-code': HTMLAttributes.code,
        class: 'scientific-mermaid-diagram-block my-4 select-none',
      }),
      HTMLAttributes.code,
    ];
  },

  addNodeView() {
    return ReactNodeViewRenderer(MermaidNodeView);
  },
});
