'use client';

import * as React from 'react';
import { X } from 'lucide-react';

interface M3ToastMessage {
  id: number;
  text: string;
  type?: 'default' | 'success' | 'error';
}

type Listener = (items: M3ToastMessage[]) => void;
let toasts: M3ToastMessage[] = [];
const listeners = new Set<Listener>();

function emit() {
  listeners.forEach((l) => l([...toasts]));
}

function pushToast(text: string, type: 'default' | 'success' | 'error' = 'default') {
  const id = Date.now() + Math.random();
  toasts = [...toasts, { id, text, type }];
  emit();
  setTimeout(() => {
    toasts = toasts.filter((t) => t.id !== id);
    emit();
  }, 3800);
}

export const toast = Object.assign(
  (text: string) => pushToast(text, 'default'),
  {
    success: (text: string) => pushToast(text, 'success'),
    error: (text: string) => pushToast(text, 'error'),
    info: (text: string) => pushToast(text, 'default'),
  }
);

export function Toaster(_props?: Record<string, any>) {
  const [items, setItems] = React.useState<M3ToastMessage[]>([]);

  React.useEffect(() => {
    listeners.add(setItems);
    return () => {
      listeners.delete(setItems);
    };
  }, []);

  if (items.length === 0) return null;

  return (
    <div className="fixed bottom-5 right-5 z-[1450] flex flex-col gap-2 max-w-[400px] w-[calc(100vw-2.5rem)] pointer-events-none">
      {items.map((item) => (
        <div
          key={item.id}
          role="status"
          className={
            item.type === 'error'
              ? 'pointer-events-auto flex min-h-[48px] items-center justify-between gap-3 rounded-[8px] bg-[#b3261e] px-4 py-2.5 text-sm font-medium text-white shadow-[0_3px_5px_-1px_rgba(0,0,0,0.2),0_6px_10px_0_rgba(0,0,0,0.14)]'
              : 'pointer-events-auto flex min-h-[48px] items-center justify-between gap-3 rounded-[8px] bg-[#303030] px-4 py-2.5 text-sm font-medium text-[#f2f2f2] shadow-[0_3px_5px_-1px_rgba(0,0,0,0.2),0_6px_10px_0_rgba(0,0,0,0.14)]'
          }
        >
          <span className="flex-1">{item.text}</span>
          <button
            type="button"
            onClick={() => {
              toasts = toasts.filter((t) => t.id !== item.id);
              emit();
            }}
            className="rounded-full p-1 text-white/80 hover:text-white hover:bg-white/10 cursor-pointer"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      ))}
    </div>
  );
}
