import {ChevronRight} from '@smarty-app/assets';
import {
  cn,
  SmartyIcon,
  SmartyIconSize,
  SmartyPressable,
  SmartySkeletonLoading,
  SmartyText,
  SmartyView,
} from '@smarty-app/controls-basic';
import {core} from '@smarty-app/design-tokens';
import {isEmpty} from 'lodash';
import {JSX, ReactNode, useMemo} from 'react';
import {PressableProps, View} from 'react-native';

import {
  getRoundingForListItemPosition,
  ListItemPosition,
} from './hooks/smartyListHooks';

export type ActionListItemChildType = 'icon' | 'other';

/** The design-token background an action list item can take. */
export type ActionListItemBackground = 'primary' | 'secondary';

const BACKGROUND_CLASS_NAMES: Record<ActionListItemBackground, string> = {
  primary: 'bg-background-primary',
  secondary: 'bg-background-secondary',
};

const ACTION_LIST_ITEM_MIN_HEIGHT = 64; // 4rem — matches --action-list-min-height Figma token

export type SmartyActionListItemProps = {
  /** The item/row title text. */
  title: string;
  titleClassName?: string;
  titleNumberOfLines?: number;
  itemKey?: number | string;
  onPress?: () => void;
  /** The detail text on the right. */
  rightDetail?: string;
  rightDetailClassName?: string;
  leftChild?: ReactNode;
  rightChild?: ReactNode;
  leftChildType?: ActionListItemChildType;
  rightChildType?: ActionListItemChildType;
  leftChildToTop?: boolean;
  /** If true, the right child will be a chevron indicating navigation. */
  rightArrowShow?: boolean;
  className?: string;
  /** The item's background. Defaults to `secondary`; use `primary` when the item sits on a secondary surface. */
  background?: ActionListItemBackground;
  selected?: boolean;
  /** Only required if the item is part of an ActionList. */
  itemPosition?: ListItemPosition;
  children?: ReactNode;
  isLoading?: boolean;
} & PressableProps;

/**
 * "Action list" item with title, supporting text, and left and right children.
 * Used in lists and menus.
 *
 * @param {SmartyActionListItemProps} props - props
 * @returns JSX.Element
 */
export const SmartyActionListItem = (
  props: SmartyActionListItemProps,
): JSX.Element => {
  const {
    itemKey,
    title,
    titleClassName,
    titleNumberOfLines,
    testID,
    className,
    background = 'secondary',
    onPress,
    rightDetail,
    rightDetailClassName = 'text-foreground-accent',
    leftChild,
    rightChild,
    leftChildType,
    rightChildType,
    leftChildToTop = false,
    rightArrowShow = false,
    children,
    selected,
    itemPosition,
    isLoading,
    ...rest
  } = props;

  const itemKeyFinal = useMemo(
    () => itemKey ?? testID ?? title,
    [itemKey, testID, title],
  );

  const leftChildComponent = useMemo(() => {
    if (!leftChild) return null;
    if (leftChildType === 'icon') {
      // TODO: Ensure we have this icon style.
      return (
        <View className={`smarty-medium-icon smarty-pr-m`}>{leftChild}</View>
      );
    }
    return <View className={'smarty-pr-m'}>{leftChild}</View>;
  }, [leftChild, leftChildType]);

  const rightChildComponent = useMemo(() => {
    if (rightArrowShow) {
      // Note that this icon is well-padded horizontally, so we get extra "gap" from that.  This is as-designed in Figma.
      return (
        <View className={`smarty-medium-icon`}>
          <SmartyIcon
            icon={ChevronRight}
            size={SmartyIconSize.Medium}
            color={core.brand.white[0]}
          />
        </View>
      );
    }
    if (!rightChild) return null;

    if (rightChildType === 'icon') {
      return <View className={`smarty-medium-icon`}>{rightChild}</View>;
    }
    return rightChild;
  }, [rightArrowShow, rightChild, rightChildType]);

  const textColor = 'text-foreground-primary';

  const containerClassName = useMemo(
    () =>
      cn(
        className,
        // We need w-full for when there's a parent container, such as SmartyContentCard.
        'w-full',
        BACKGROUND_CLASS_NAMES[background],
        getRoundingForListItemPosition(itemPosition),
        selected && 'border-solid border border-foreground-primary',
      ),
    [className, background, selected, itemPosition],
  );

  const contentRowClassName = useMemo(
    () =>
      cn('flex-row smarty-px-l smarty-py-m', !leftChildToTop && 'items-center'),
    [leftChildToTop],
  );

  // grow stops the title being laid out at exactly its measured width. Android
  // can then report it as two lines while drawing one, leaving a gap below it.
  const titleClassNameMemo = useMemo(
    () => cn(`grow smarty-body-m ${textColor}`, titleClassName),
    [titleClassName],
  );

  const rightDetailsClassNameMemo = useMemo(
    () => cn(`smarty-body-m ${textColor}`, rightDetailClassName),
    [rightDetailClassName],
  );

  return (
    <SmartyView
      testID={testID || 'smarty-action-list-item'}
      importantForAccessibility="yes">
      <SmartyPressable
        className={containerClassName}
        key={itemKeyFinal}
        overlayClassName={
          getRoundingForListItemPosition(itemPosition) ?? 'rounded-none'
        }
        onPress={onPress}
        disabled={isLoading || !onPress}
        {...rest}>
        <View
          style={{minHeight: ACTION_LIST_ITEM_MIN_HEIGHT}}
          className={`justify-center`}>
          <View className={contentRowClassName}>
            {leftChildComponent}
            <View className={`flex-1`}>
              {/* The title and detail share a line until they would come
                  within the gap of each other, then the detail wraps below.
                  The growing title puts the detail at the right edge while it
                  shares the title's line, and at the left once it is alone.
                  items-center centres the detail against a multi-line title. */}
              <View
                className={`flex-row flex-wrap items-center justify-between smarty-gap-x-m`}>
                <SmartyText
                  numberOfLines={titleNumberOfLines}
                  className={titleClassNameMemo}>
                  {isEmpty(title) ? ' ' : title}
                </SmartyText>
                {!!rightDetail && (
                  <SmartyText className={rightDetailsClassNameMemo}>
                    {rightDetail}
                  </SmartyText>
                )}
              </View>
              {children && children}
            </View>
            {rightChildComponent && (
              <View className={`smarty-ml-s`}>{rightChildComponent}</View>
            )}
          </View>
        </View>
      </SmartyPressable>
      {isLoading && (
        <View className={cn('absolute h-full w-full', containerClassName)}>
          <SmartySkeletonLoading className={'h-full w-full'} />
        </View>
      )}
    </SmartyView>
  );
};
