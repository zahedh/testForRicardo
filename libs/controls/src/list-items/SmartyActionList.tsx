import {cn, SmartyText} from '@smarty-app/controls-basic';
import {JSX} from 'react';
import {View, ViewProps} from 'react-native';

import {getListItemPosition} from './hooks/smartyListHooks';
import {
  ActionListItemBackground,
  SmartyActionListItem,
  SmartyActionListItemProps,
} from './SmartyActionListItem';
import {
  SmartyActionListSwitch,
  SmartyActionListSwitchProps,
} from './SmartyActionListSwitch';

export type SmartyActionListTitleProps = {
  containerClassName?: string;
  title: string;
  titleClassName?: string;
  titleNumberOfLines?: number;
} & ViewProps;

/**
 * Standard title for an "Action list".
 *
 * @param {SmartyActionListTitleProps} props - props
 * @returns JSX.Element
 */
export const SmartyActionListTitle = (
  props: SmartyActionListTitleProps,
): JSX.Element => {
  const {
    testID = 'action-list-title',
    containerClassName,
    title,
    titleClassName,
    titleNumberOfLines,
  } = props;

  return (
    <View
      testID={testID}
      className={cn(
        `smarty-pl-m smarty-pb-s bg-background-primary`,
        containerClassName,
      )}>
      <SmartyText
        className={cn(
          `smarty-body-l font-theme-bold text-foreground-primary`,
          titleClassName,
        )}
        numberOfLines={titleNumberOfLines}>
        {title}
      </SmartyText>
    </View>
  );
};

export type SmartyActionListCaptionProps = {
  containerClassName?: string;
  /** Caption text. */
  caption: string;
  captionClassName?: string;
  captionNumberOfLines?: number;
} & ViewProps;

/**
 * Standard caption for an "Action list" (positioned at the bottom of the list).
 *
 * @param {SmartyActionListCaptionProps} props - props
 * @returns JSX.Element
 */
export const SmartyActionListCaption = (
  props: SmartyActionListCaptionProps,
): JSX.Element => {
  const {
    testID = 'action-list-caption',
    containerClassName,
    caption,
    captionClassName,
    captionNumberOfLines,
  } = props;

  return (
    <View
      testID={testID}
      // Caption has small top padding, as SmartyActionList doesn't provide spacing before it.
      // It also has bottom padding, as designs stipulate this.
      className={cn(`smarty-pl-m smarty-pt-s smarty-pb-s`, containerClassName)}>
      <SmartyText
        className={cn(
          'smarty-caption-l text-start text-foreground-primary',
          captionClassName,
        )}
        numberOfLines={captionNumberOfLines}>
        {caption}
      </SmartyText>
    </View>
  );
};

export type SmartyActionListProps = {
  className?: string;
  /** If defined, a {@link SmartyActionListTitle} will be displayed above the top item. */
  title?: string;
  /** If defined, a {@link SmartyActionListCaption} will be displayed below the bottom item. */
  caption?: string;
  items: (SmartyActionListItemProps | SmartyActionListSwitchProps)[];
  /** The background passed to each {@link SmartyActionListItem}, unless the item sets its own. Items default to `secondary`. */
  itemBackground?: ActionListItemBackground;
  testID?: string;
};

/**
 * Type guard to check if an list item is a SmartyActionListSwitchProps
 *
 * @param item - The list item to check.
 * @returns true if the item is a SmartyActionListSwitchProps, false otherwise.
 */
function isSwitchItem(
  item: SmartyActionListItemProps | SmartyActionListSwitchProps,
): item is SmartyActionListSwitchProps {
  return 'value' in item;
}

/**
 * "Action list" component.  Used to create lists and menus.
 * Creates a group of 'SmartyActionListItem's with appropriate rounding and separators based on their position in the list.
 *
 * @param {SmartyActionListProps} props - props
 * @returns JSX.Element
 */
export const SmartyActionList = (props: SmartyActionListProps): JSX.Element => {
  const {
    className,
    title,
    caption,
    items,
    itemBackground,
    testID = 'action-list',
  } = props;

  return (
    <View testID={testID} className={className}>
      {!!title && <SmartyActionListTitle title={title} />}
      {items.map((item, index) => {
        const key = item.itemKey ?? index;
        const itemPosition = getListItemPosition(index, items.length);

        return isSwitchItem(item) ? (
          <SmartyActionListSwitch
            key={key}
            {...item}
            itemPosition={itemPosition}
            value={item.value}
            onValueChange={item.onValueChange}
          />
        ) : (
          <SmartyActionListItem
            key={key}
            {...item}
            background={item.background ?? itemBackground}
            itemPosition={itemPosition}
          />
        );
      })}
      {!!caption && <SmartyActionListCaption caption={caption} />}
    </View>
  );
};
