import {SmartySwitch} from '@smarty-app/controls-basic';
import {JSX, useCallback} from 'react';
import {Platform} from 'react-native';

import {
  SmartyActionListItem,
  SmartyActionListItemProps,
} from './SmartyActionListItem';

export type SmartyActionListSwitchProps = {
  value: boolean;
  onValueChange?: (value: boolean) => void;
  /** Shows the switch's loading ring, for example while the change is saved. */
  isLoading?: boolean;
} & SmartyActionListItemProps;

/**
 * List item with switch/toggle as the right-end element.
 *
 * @param {SmartyActionListSwitchProps} props - props
 * @returns JSX.Element
 */
export const SmartyActionListSwitch = (
  props: SmartyActionListSwitchProps,
): JSX.Element => {
  const {
    testID,
    value,
    onValueChange,
    onPress,
    itemKey = 0,
    disabled,
    isLoading,
    ...rest
  } = props;

  const handleToggle = useCallback(
    (value: boolean) => {
      if (!disabled && !isLoading) {
        onValueChange?.(value);
        onPress?.();
      }
    },
    [disabled, isLoading, onValueChange, onPress],
  );

  return (
    <SmartyActionListItem
      itemKey={itemKey}
      disabled={disabled}
      onPress={() => handleToggle(!value)}
      rightChild={
        <SmartySwitch
          testID={testID}
          key="listItemSwitch"
          disabled={disabled ?? false}
          isLoading={isLoading}
          // On web, clicking the switch will generate a handleToggle both here and on the list item, so disable it here to avoid a double-call.
          // On mobile, SmartySwitch will not pass the click back to the list item, so we need to handle it here.
          onValueChange={Platform.OS === 'web' ? undefined : handleToggle}
          value={value}
        />
      }
      {...rest}
    />
  );
};
