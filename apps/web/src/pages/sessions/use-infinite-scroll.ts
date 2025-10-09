import { RefObject, useEffect } from 'react';

interface Props {
  ref: RefObject<HTMLDivElement | null>;
  bottomThreshold: number;
  onBottomReached: VoidFunction;
}

export const useInfiniteScroll = ({
  ref,
  bottomThreshold,
  onBottomReached,
}: Props) => {
  useEffect(() => {
    if (!ref.current) return;
    const scrollableParent = getScrollableParent(ref.current);

    const intersectionObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const target = entry.target;
          if (!('style' in target)) return;
          const htmlElement = target as HTMLDivElement;

          htmlElement.style.visibility =
            entry.intersectionRatio > 0 ? 'visible' : 'hidden';
        });
      },
      {
        root: scrollableParent,
        threshold: [0, 0.5, 1.0],
      },
    );

    ref.current.childNodes.forEach(
      (node) => node instanceof Element && intersectionObserver.observe(node),
    );

    const mutationObserver = new MutationObserver((mutations) => {
      for (const entry of mutations) {
        if (entry.type !== 'childList') return;
        // remove unused observers
        entry.removedNodes.forEach(
          (node) =>
            node instanceof Element && intersectionObserver.unobserve(node),
        );
        // add new observers
        entry.addedNodes.forEach(
          (node) =>
            node instanceof Element && intersectionObserver.observe(node),
        );
      }
    });
    mutationObserver.observe(scrollableParent, {
      childList: true,
    });

    const onScroll = () => {
      const bottom =
        scrollableParent.scrollHeight -
        scrollableParent.scrollTop -
        scrollableParent.clientHeight;

      if (bottom < bottomThreshold) {
        onBottomReached();
      }
    };

    scrollableParent.addEventListener('scroll', onScroll, true);
    return () => {
      intersectionObserver.disconnect();
      mutationObserver.disconnect();
      scrollableParent.removeEventListener('scroll', onScroll);
    };
  }, [bottomThreshold, onBottomReached, ref]);
};

/**
 * Finds the first scrollable parent of an element.
 * @param {HTMLElement} el The element to start from.
 * @returns {HTMLElement} The first scrollable parent or the document's scrolling element.
 */
function getScrollableParent(el: HTMLDivElement): Element {
  // Start with the immediate parent
  let parent = el.parentElement;

  // Regex to check for 'auto' or 'scroll' in overflow properties
  const overflowRegex = /(auto|scroll)/;

  while (parent) {
    // Get the computed styles of the parent element
    const parentStyle = window.getComputedStyle(parent);

    // Check if the overflow-y or overflow-x property is 'auto' or 'scroll'
    const isScrollable = overflowRegex.test(
      parentStyle.getPropertyValue('overflow') +
        parentStyle.getPropertyValue('overflow-y') +
        parentStyle.getPropertyValue('overflow-x'),
    );

    // Check if the element actually has overflowing content
    const hasOverflow =
      parent.scrollHeight > parent.clientHeight ||
      parent.scrollWidth > parent.clientWidth;

    if (isScrollable && hasOverflow) {
      return parent;
    }

    // Move up to the next parent
    parent = parent.parentElement;
  }

  // If no scrollable parent is found, return the document's root scrolling element
  return document.scrollingElement || document.documentElement;
}
