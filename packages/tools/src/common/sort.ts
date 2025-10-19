import { getKeySelectorValue, KeySelector } from '../internal/key-selector.ts';

/**
 * Returns a sorter function that ranks the items based on the selected property
 *
 * @param by can be either a property key, or a property selector function
 * @param direction ascending or descending sorting
 * @example
 * ```ts
 * const array: Item = [...items]
 * // syntax 1
 * array.toSorted(getPropertySorter(item => item.prop))
 * // syntax 2
 * array.toSorted(getPropertySorter('prop'))
 * ```
 */
export function getPropertySorter<T>(
  by: KeySelector<T>,
  direction?: 'asc' | 'desc',
) {
  const sorter = (a: T, b: T): number => {
    const valueA = getKeySelectorValue(a, by);
    const valueB = getKeySelectorValue(b, by);

    if (typeof valueA === 'string' && typeof valueB === 'string') {
      return valueA.localeCompare(valueB);
    }

    if (typeof valueA === 'number' && typeof valueB === 'number') {
      return valueA - valueB;
    }

    if (valueA < valueB) return -1;
    if (valueA > valueB) return 1;
    return 0;
  };

  return (a: T, b: T): number => sorter(a, b) * (direction === 'desc' ? -1 : 1);
}

export const sortHelpers = { getPropertySorter };
