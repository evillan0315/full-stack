import { Component, createSignal, createEffect, onCleanup } from 'solid-js';
import { throttle } from '@solid-primitives/scheduled';
import { isFirefox } from '@solid-primitives/platform';

const Dot: Component<{ isDragging: boolean }> = (props) => {
  return (
    <span
      class="h-1 w-1 rounded-full"
      classList={{
        'bg-neutral-900': props.isDragging,
        'dark:bg-neutral-900': props.isDragging,
      }}
    />
  );
};

type SolidRef = (el: HTMLDivElement) => void;

export const GridResizer: Component<{
  ref?: HTMLDivElement | SolidRef;
  isHorizontal: boolean;
  onResize: (clientX: number, clientY: number) => void;
}> = (props) => {
  const [isDragging, setIsDragging] = createSignal(false);

  const onResizeStart = () => setIsDragging(true);
  const onResizeEnd = () => setIsDragging(false);

  const onMouseMove = throttle((e: MouseEvent) => {
    if (isDragging()) {
      props.onResize(e.clientX, e.clientY);
    }
  }, 10);

  const onTouchMove = throttle((e: TouchEvent) => {
    if (isDragging()) {
      const touch = e.touches[0];
      props.onResize(touch.clientX, touch.clientY);
    }
  }, 10);

  const setRef = (el: HTMLDivElement) => {
    if (typeof props.ref === 'function') props.ref(el);
    el.addEventListener('mousedown', onResizeStart, { passive: true });
    el.addEventListener('touchstart', onResizeStart, { passive: true });

    onCleanup(() => {
      el.removeEventListener('mousedown', onResizeStart);
      el.removeEventListener('touchstart', onResizeStart);
    });
  };

  createEffect(() => {
    if (isDragging()) {
      if (isFirefox) {
        document.querySelectorAll('iframe').forEach((el) => (el.style.pointerEvents = 'none'));
      }

      window.addEventListener('mousemove', onMouseMove);
      window.addEventListener('mouseup', onResizeEnd);
      window.addEventListener('touchmove', onTouchMove);
      window.addEventListener('touchend', onResizeEnd);
    } else {
      if (isFirefox) {
        document.querySelectorAll('iframe').forEach((el) => (el.style.pointerEvents = ''));
      }

      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onResizeEnd);
      window.removeEventListener('touchmove', onTouchMove);
      window.removeEventListener('touchend', onResizeEnd);
    }
  });

  return (
    <div
      ref={setRef}
      class="flex items-center justify-center gap-2 border-neutral-200 dark:border-neutral-800 z-10"
      classList={{
        'bg-brand-default dark:bg-brand-default': isDragging(),
        'bg-neutral-900 dark:bg-solid-darkbg/70': !isDragging(),
        'flex-col cursor-col-resize border-l border-r w-[2px]': !props.isHorizontal,
        'flex-row cursor-row-resize border-t border-b h-[2px]': props.isHorizontal,
      }}
    >
      <div
        classList={{
          'fixed inset-0 z-10': isDragging(),
          'hidden': !isDragging(),
          'cursor-col-resize': !props.isHorizontal,
          'cursor-row-resize': props.isHorizontal,
        }}
      />
      <Dot isDragging={isDragging()} />
      <Dot isDragging={isDragging()} />
      <Dot isDragging={isDragging()} />
    </div>
  );
};
