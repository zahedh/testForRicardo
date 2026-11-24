import {core, semantic} from '@smarty-app/design-tokens';
import {en} from '@smarty-app/language';
import {useOnResolveThemeColor} from '@smarty-app/util-generic';
import {JSX, useState} from 'react';
import {Platform, Switch, View} from 'react-native';

import {SmartyLoadingBorder} from '../buttons/SmartyLoadingBorder';

/** Large enough for the loading ring to follow the switch's pill shape. */
const SWITCH_BORDER_RADIUS = 100;

export type SmartySwitchProps = {
  testID?: string;
  disabled?: boolean;
  /** Current state of the switch. True if the switch is on, false if it is off. */
  value: boolean;
  onValueChange?: (value: boolean) => void;
  /** Shows an animated ring around the switch, as on a loading button. */
  isLoading?: boolean;
};

/**
 * Basic switch/toggle component.
 *
 * @param {SmartySwitchProps} props - props
 * @returns JSX.Element
 */
export const SmartySwitch = (props: SmartySwitchProps): JSX.Element => {
  const {testID, value, onValueChange, disabled, isLoading} = props;
  const [layout, setLayout] = useState({width: 0, height: 0});
  const onResolveThemeColor = useOnResolveThemeColor();
  const switchColor = disabled
    ? onResolveThemeColor(semantic.foreground.secondary)
    : core.brand.white[0];
  const backgroundColorOff = disabled
    ? onResolveThemeColor(semantic.background.tertiary)
    : Platform.OS === 'ios'
      ? 'black'
      : onResolveThemeColor(semantic.background.primary); // Very dark.
  const backgroundColorOn = disabled
    ? onResolveThemeColor(semantic.background.tertiary)
    : core.accent.teal[900];
  const borderColorOff = disabled
    ? switchColor
    : onResolveThemeColor(semantic.stroke.medium);
  const borderColorOn = disabled ? switchColor : core.accent.teal[900];

  return (
    <View onLayout={(event) => setLayout(event.nativeEvent.layout)}>
      <View
        style={{
          // This view defined a border, so our switch can have an outline.
          // It needs a background colour to fill any tiny cracks between the border and native switch component.
          backgroundColor: value ? backgroundColorOn : backgroundColorOff,
          borderWidth: 2,
          borderColor: value ? borderColorOn : borderColorOff,
          borderRadius: SWITCH_BORDER_RADIUS,
        }}>
        <Switch
          testID={testID}
          style={{
            ...(Platform.OS === 'ios' ? {marginRight: -2} : {}), // iOS creates extra padding on the right that needs to be removed.
            ...(Platform.OS === 'web' ? {margin: 2} : {}), // Web needs a little margin so that the switch doesn't touch the border.
          }}
          // Note that on iOS an extra opacity is applied to background (and potentially also switch color) when off or disabled,
          // making it appear lighter or darker, depending on iOS version.
          disabled={disabled ?? false}
          onValueChange={(value: boolean) => {
            if (!disabled && !isLoading) {
              onValueChange?.(value);
            }
          }}
          value={value}
          trackColor={{
            false: backgroundColorOff,
            true: backgroundColorOn,
          }}
          thumbColor={switchColor}
          // This is the color it uses when the switch is off or disabled on iOS.
          // Unfortunately, it creates an overflow problem on the right which interferes with our border, so we can't really use it.
          //ios_backgroundColor={'transparent'}
          // Web requires active state thumb color also.
          {...(Platform.OS === 'web' && {activeThumbColor: switchColor})}
          accessible={true}
          accessibilityRole="switch"
          accessibilityValue={{
            text: value ? en.accessibilityOnOption : en.accessibilityOffOption,
          }}
          accessibilityState={{
            checked: value,
            disabled: !!disabled,
            busy: !!isLoading,
          }}
        />
      </View>
      {isLoading && (
        <SmartyLoadingBorder
          width={layout.width}
          height={layout.height}
          borderRadius={SWITCH_BORDER_RADIUS}
        />
      )}
    </View>
  );
};
