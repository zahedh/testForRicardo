import {useTopBarInset} from '@smarty-app/components';
import {SmartyFlatList, SmartyFlatListProps} from '@smarty-app/controls';
import {JSX} from 'react';
import {RefreshControl, StyleSheet} from 'react-native';

import {
  StackRootListContainer,
  useStackRootListChrome,
} from './StackRootListChrome';

export interface StackRootFlatListProps<
  ItemT,
> extends SmartyFlatListProps<ItemT> {
  /** True if we want to add the safe area top padding. This would usually be when the containing screen's header is off. */
  addSafeTop?: boolean;
  /** True if we want to show the loading view overlay. */
  shouldShowLoadingView?: boolean;
  loadingViewTestID?: string;
}

/**
 * Stack screen's root flat list, to be used at the top level of a stack screen
 * whose content is a list. It scrolls behind the translucent top app bar, in
 * the same content card as `StackRootScrollView`.
 *
 * If `onRefresh` is given, the list supports pull-to-refresh. The refresh
 * indicator is offset below the top app bar, which would otherwise hide it.
 *
 * @param props - Component props {@link StackRootFlatListProps}.
 * @returns A React element.
 */
export function StackRootFlatList<ItemT>(
  props: StackRootFlatListProps<ItemT>,
): JSX.Element {
  const {
    addSafeTop,
    shouldShowLoadingView,
    loadingViewTestID,
    isLoading,
    ListHeaderComponent,
    ListFooterComponent,
    refreshing,
    onRefresh,
    contentContainerStyle,
    ...rest
  } = props;

  const topBarInset = useTopBarInset();
  const {listHeader, listFooter} = useStackRootListChrome(
    ListHeaderComponent,
    ListFooterComponent,
  );

  return (
    <StackRootListContainer
      addSafeTop={addSafeTop}
      shouldShowLoadingView={shouldShowLoadingView}
      loadingViewTestID={loadingViewTestID}
      isLoading={isLoading}
      ListHeaderComponent={ListHeaderComponent}>
      <SmartyFlatList<ItemT>
        {...rest}
        isLoading={isLoading}
        ListHeaderComponent={listHeader}
        ListFooterComponent={listFooter}
        showsVerticalScrollIndicator={false}
        contentContainerClassName="bg-background-primary"
        // Grow so that the content card reaches the bottom of the screen even
        // when the list is short or empty.
        contentContainerStyle={[styles.contentContainer, contentContainerStyle]}
        refreshControl={
          onRefresh ? (
            <RefreshControl
              refreshing={refreshing ?? false}
              onRefresh={onRefresh}
              progressViewOffset={topBarInset}
            />
          ) : undefined
        }
      />
    </StackRootListContainer>
  );
}

const styles = StyleSheet.create({
  contentContainer: {flexGrow: 1},
});
