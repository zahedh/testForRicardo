import {useTopBarInset} from '@smarty-app/components';
import {LoadingView} from '@smarty-app/controls';
import {BOTTOM_PADDING_PX} from '@smarty-app/core';
import React, {
  ComponentType,
  isValidElement,
  ReactElement,
  ReactNode,
} from 'react';
import {View} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

import {StackRootBackdrop} from './StackRootScrollView';

/** The shape of a `ListHeaderComponent` / `ListFooterComponent` prop, shared by `FlatListProps` and `SectionListProps`. */
export type StackRootListComponentProp =
  ComponentType | ReactElement | null | undefined;

/**
 * Renders a list header/footer prop, which is either an element or a component.
 *
 * @param component - The `ListHeaderComponent` / `ListFooterComponent` prop value.
 * @returns The rendered node, or null when there is nothing to render.
 */
export function renderStackRootListComponent(
  component: StackRootListComponentProp,
): ReactNode {
  if (!component) {
    return null;
  }
  if (isValidElement(component)) {
    return component;
  }

  const Component = component as ComponentType;
  return <Component />;
}

export interface StackRootListChrome {
  listHeader: ReactElement;
  listFooter: ReactElement;
}

/**
 * Builds the list header/footer chrome shared by every stack screen's root
 * list (`StackRootFlatList`, `StackRootSectionList`).
 *
 * The header opens the content with the top app bar's tint, so the rows
 * scroll up behind the translucent app bar, then starts the content card.
 * Both views are opaque, so the card's rounded corners cut out of the tint
 * rather than out of the content container's own background. The card's top
 * padding is half its corner radius, so the corners are drawn by an overlay as
 * tall as the radius, which runs down behind the first rows and keeps the
 * curve whole. The skeleton replaces the list and so renders none of this;
 * `StackRootListContainer` wraps it in `StackRootListLoadingCard` instead. The
 * footer closes with either a non-zero "safe area" bottom or the default
 * padding.
 *
 * @param ListHeaderComponent - The list's own `ListHeaderComponent` prop.
 * @param ListFooterComponent - The list's own `ListFooterComponent` prop.
 * @returns The header/footer nodes to pass to the underlying list.
 */
export function useStackRootListChrome(
  ListHeaderComponent: StackRootListComponentProp,
  ListFooterComponent: StackRootListComponentProp,
): StackRootListChrome {
  const {bottom} = useSafeAreaInsets();
  const topBarInset = useTopBarInset();

  const listHeader = (
    <View className={'bg-background-tertiary'}>
      <View style={{height: topBarInset}} />
      <View className={'bg-background-primary smarty-pt-l'}>
        {/* The card's corners, as tall as `smarty-rounded-t-2xl` (32px). It
            comes first so the header's own content draws over it. */}
        <View
          pointerEvents="none"
          className={'absolute inset-x-0 top-0 h-8 bg-background-tertiary'}>
          <View
            className={'flex-1 bg-background-primary smarty-rounded-t-2xl'}
          />
        </View>
        {renderStackRootListComponent(ListHeaderComponent)}
      </View>
    </View>
  );

  const listFooter = (
    <View style={{paddingBottom: bottom || BOTTOM_PADDING_PX}}>
      {renderStackRootListComponent(ListFooterComponent)}
    </View>
  );

  return {listHeader, listFooter};
}

/**
 * Props for the `StackRootListLoadingCard` component.
 */
interface StackRootListLoadingCardProps {
  /** The list's own `ListHeaderComponent` prop. */
  ListHeaderComponent: StackRootListComponentProp;
  /** The list, which is rendering its skeleton. */
  children: ReactNode;
}

/**
 * The content card for a stack screen's root list while it shows its
 * skeleton.
 *
 * The skeleton replaces the list wholesale, so it renders none of
 * `listHeader` (the top bar inset, the card and its corners, and the list's
 * own `ListHeaderComponent`) and none of the content container's background.
 * Without this card the backdrop would show through. As in
 * `StackRootScrollView`, one card wraps the header and the skeleton.
 *
 * @param props - Component props {@link StackRootListLoadingCardProps}.
 * @returns a JSX.Element wrapping the given list.
 */
function StackRootListLoadingCard(
  props: StackRootListLoadingCardProps,
): ReactElement {
  const {ListHeaderComponent, children} = props;

  const topBarInset = useTopBarInset();

  return (
    <View className={'flex-1'}>
      <View style={{height: topBarInset}} />
      <View
        className={
          'flex-1 bg-background-primary smarty-rounded-t-2xl smarty-pt-l'
        }>
        {renderStackRootListComponent(ListHeaderComponent)}
        {children}
      </View>
    </View>
  );
}

export interface StackRootListContainerProps {
  /** True if we want to add the safe area top padding.  This would usually be when the containing screen's header is off. */
  addSafeTop?: boolean;
  /** True if we want to show the loading view overlay. */
  shouldShowLoadingView?: boolean;
  loadingViewTestID?: string;
  /** True while the list shows its skeleton, which then gets wrapped in the loading card. */
  isLoading?: boolean;
  /** The list's own `ListHeaderComponent` prop, rendered in the loading card. */
  ListHeaderComponent?: StackRootListComponentProp;
  children: ReactNode;
}

/**
 * The outer chrome shared by every stack screen's root list: the backdrop,
 * the optional safe-area top padding, the loading card around the skeleton,
 * and the loading view overlay.
 *
 * @param props - Component props {@link StackRootListContainerProps}.
 * @returns a JSX.Element wrapping the given list.
 */
export function StackRootListContainer(
  props: StackRootListContainerProps,
): ReactElement {
  const {
    addSafeTop = false,
    shouldShowLoadingView,
    loadingViewTestID,
    isLoading = false,
    ListHeaderComponent,
    children,
  } = props;

  const {top} = useSafeAreaInsets();

  return (
    <View
      className={'flex-1 bg-background-tertiary'}
      style={{
        paddingTop: addSafeTop ? top : 0,
      }}>
      <StackRootBackdrop />
      {isLoading ? (
        <StackRootListLoadingCard ListHeaderComponent={ListHeaderComponent}>
          {children}
        </StackRootListLoadingCard>
      ) : (
        children
      )}

      <LoadingView
        testID={loadingViewTestID ?? 'loading-view'}
        visible={shouldShowLoadingView || false}
      />
    </View>
  );
}
