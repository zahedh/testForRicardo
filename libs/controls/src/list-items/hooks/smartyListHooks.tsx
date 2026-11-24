export type ListItemPosition = 'top' | 'middle' | 'bottom';

/**
 * Gets the {@link ListItemPosition} for a list item based on its index and the total number of items in the list.
 *
 * @param listIndex Index of the item in the list.
 * @param listLength Total number of items in the list.
 * @returns The position type of the list item.
 */
export function getListItemPosition(
  listIndex: number,
  listLength: number,
): ListItemPosition | undefined {
  if (listLength === 1) {
    return undefined;
  }
  if (listIndex === 0) {
    return 'top';
  }
  if (listIndex === listLength - 1) {
    return 'bottom';
  }
  return 'middle';
}

/**
 * Gets rounding for list items in the specified position in a list.
 *
 * @param positionType List position.
 * @returns The rounding class for the specified list position.
 */
export function getRoundingForListItemPosition(
  positionType: ListItemPosition | undefined,
): string | undefined {
  switch (positionType) {
    case 'top':
      return 'smarty-rounded-t-xl';
    case 'middle':
      return undefined;
    case 'bottom':
      return 'smarty-rounded-b-xl';
    default:
      return 'smarty-rounded-xl'; // Undefined means the item is not in a list, so all corners will be rounded.
  }
}

/**
 * Gets rounding for list items in the specified position in a list.
 *
 * @param listIndex Index of the item in the list.
 * @param listLength Total number of items in the list.
 * @returns The rounding class for the specified list position.
 */
export function getRoundingForListItemIndex(
  listIndex: number,
  listLength: number,
): string | undefined {
  const positionType = getListItemPosition(listIndex, listLength);
  return getRoundingForListItemPosition(positionType);
}
