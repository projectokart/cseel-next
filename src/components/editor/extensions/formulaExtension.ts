import { Node, mergeAttributes } from '@tiptap/core';
import { ReactNodeViewRenderer } from '@tiptap/react';
import FormulaNodeView from '../nodes/FormulaNodeView';

export const FormulaExtension = Node.create({
  name: 'formula',
  group: 'block',
  atom: true,
  draggable: true,

  addAttributes() {
    return {
      latex: {
        default: 'E = mc^2',
      },
      displayMode: {
        default: true,
      },
    };
  },

  parseHTML() {
    return [
      {
        tag: 'div[data-type="formula"]',
        getAttrs: (element) => {
          if (typeof element === 'string') return {};
          return {
            latex: element.getAttribute('data-latex') || '',
            displayMode: element.getAttribute('data-display-mode') !== 'false',
          };
        },
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    return [
      'div',
      mergeAttributes(HTMLAttributes, {
        'data-type': 'formula',
        'data-latex': HTMLAttributes.latex,
        'data-display-mode': HTMLAttributes.displayMode ? 'true' : 'false',
        class: 'scientific-formula-block my-3 select-none',
      }),
      `$$${HTMLAttributes.latex}$$`,
    ];
  },

  addNodeView() {
    return ReactNodeViewRenderer(FormulaNodeView);
  },
});
