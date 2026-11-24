import {cn, SmartySkeletonLoading} from '@smarty-app/controls-basic';
import {ForwardedRef, forwardRef, JSX} from 'react';
import {FlatList, FlatListProps, View} from 'react-native';

export interface SmartyFlatListProps<ItemT> extends FlatListProps<ItemT> {
  /** When true, renders skeleton placeholders instead of the list content. */
  isLoading?: boolean;
  /** Number of skeleton placeholders to render while loading. Defaults to 10. */
  skeletonCount?: number;
  /** Additional Tailwind classes applied to each skeleton placeholder. Defaults to h-20 w-full my-2. */
  skeletonClassName?: string;
  /** Tailwind classes applied to the skeleton container. */
  skeletonContainerClassName?: string;
}

/**
 * A component which renders list content from {@link SmartyFlatListProps}, i.e.
 * {@link SmartyFlatList} itself or a wrapper which adds chrome around it.
 *
 * Screen views take this as a prop so each platform can supply its own list
 * container without the screen view knowing anything about it.
 */
export type SmartyFlatListRenderer = <ItemT>(
  props: SmartyFlatListProps<ItemT>,
) => JSX.Element;

/**
 * A reusable {@link FlatList} wrapper that renders animated skeleton
 * placeholders while loading and the flat list content otherwise.
 *
 * @param props - Component props {@link SmartyFlatListProps}.
 * @param ref - Forwarded ref to the underlying {@link FlatList}.
 * @returns A React element rendering skeletons or the flat list.
 */
function SmartyFlatListComponent<ItemT>(
  props: SmartyFlatListProps<ItemT>,
  ref: ForwardedRef<FlatList<ItemT>>,
): JSX.Element {
  const {
    isLoading = false,
    skeletonCount = 10,
    skeletonClassName,
    skeletonContainerClassName,
    testID = 'smarty-flat-list',
    ...flatListProps
  } = props;

  if (isLoading) {
    return (
      <View
        testID={`${testID}-skeleton`}
        className={cn(flatListProps.className, skeletonContainerClassName)}>
        {Array.from({length: skeletonCount}).map((_, index) => (
          <SmartySkeletonLoading
            key={index}
            className={cn('h-20 w-full my-2', skeletonClassName)}
          />
        ))}
      </View>
    );
  }

  return <FlatList<ItemT> ref={ref} testID={testID} {...flatListProps} />;
}

/**
 * A reusable {@link FlatList} wrapper that renders animated skeleton
 * placeholders while loading and the flat list content otherwise.
 */
export const SmartyFlatList = forwardRef(SmartyFlatListComponent) as <ItemT>(
  props: SmartyFlatListProps<ItemT> & {
    ref?: ForwardedRef<FlatList<ItemT>>;
  },
) => JSX.Element;
