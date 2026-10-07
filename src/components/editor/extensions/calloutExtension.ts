import { Node, mergeAttributes } from '@tiptap/core';
import { ReactNodeViewRenderer } from '@tiptap/react';
import CalloutNodeView from '../nodes/CalloutNodeView';

export const CalloutExtension = Node.create({
  name: 'callout',
  group: 'block',
  content: 'block+',
  defining: true,

  addAttributes() {
    return {
      variant: {
        default: 'note', // 'note' | 'tip' | 'warning' | 'definition' | 'example' | 'assessment'
      },
      title: {
        default: '',
      },
    };
  },

  parseHTML() {
    return [
      {
        tag: 'div[data-type="callout"]',
        getAttrs: (element) => {
          if (typeof element === 'string') return {};
          return {
            variant: element.getAttribute('data-variant') || 'note',
            title: element.getAttribute('data-title') || '',
          };
        },
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    return [
      'div',
      mergeAttributes(HTMLAttributes, {
        'data-type': 'callout',
        'data-variant': HTMLAttributes.variant,
        'data-title': HTMLAttributes.title || '',
        class: `callout-card callout-${HTMLAttributes.variant} my-3`,
      }),
      0,
    ];
  },

  addNodeView() {
    return ReactNodeViewRenderer(CalloutNodeView);
  },
});
