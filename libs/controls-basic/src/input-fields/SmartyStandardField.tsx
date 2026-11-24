import {CircleAlert} from '@smarty-app/assets';
import {core} from '@smarty-app/design-tokens';
import React, {JSX} from 'react';
import {TextInput, TextInputProps, View} from 'react-native';

import {SmartyText} from '../basics/SmartyText';
import {cn} from '../classNameUtil';
import {SmartyIcon, SmartyIconSize} from '../icon/SmartyIcon';
import {SmartyBasicField} from './SmartyBasicField';

export type SmartyStandardFieldProps = {
  className?: string;
  title?: string;
  titleStyle?: string;
  supportingText?: string;
  supportingMultipleText?: string[];
  error?: string;
  children?: React.ReactNode;
  monoFont?: boolean;
  leftChild?: React.ReactNode;
  rightChild?: React.ReactNode;
  showClearText?: boolean;
  value: string;
  overrideOnClearText?: () => void;
  disabled?: boolean;
} & TextInputProps;

export const SmartyStandardField = React.forwardRef(
  (
    props: SmartyStandardFieldProps,
    ref: React.ForwardedRef<TextInput>,
  ): JSX.Element => {
    const {
      className,
      title,
      titleStyle,
      supportingText,
      supportingMultipleText,
      error,
      monoFont,
      leftChild,
      rightChild,
      showClearText = true,
      children,
      value,
      disabled,
      overrideOnClearText,
      ...rest
    } = props;
    return (
      <View className={cn(className, 'smarty-gap-y-m')}>
        <View className="flex-row">
          <SmartyText
            className={`smarty-body-l font-theme-bold text-foreground-primary ${titleStyle ? ` ${titleStyle}` : ''}`}>
            {title}
          </SmartyText>
          {children && children}
        </View>
        <SmartyBasicField
          testID={props.testID}
          ref={ref}
          monoFont={monoFont}
          value={value}
          error={error !== undefined}
          leftChild={leftChild}
          rightChild={rightChild}
          showClearText={showClearText}
          overrideOnClearText={overrideOnClearText}
          onChangeText={props.onChangeText}
          disabled={disabled}
          {...rest}
        />

        {!!supportingText && (
          <SmartyText
            testID="text-input-supporting-text"
            className={`smarty-caption-l text-foreground-secondary`}>
            {supportingText}
          </SmartyText>
        )}

        {!!supportingMultipleText &&
          supportingMultipleText.map((supportingText, index) => (
            <SmartyText
              key={index}
              testID={`text-input-supporting-text-${index}`}
              className={`smarty-caption-l text-foreground-secondary`}>
              {supportingText}
            </SmartyText>
          ))}

        {!!error && !disabled && (
          <View className="flex-row items-center">
            <SmartyIcon
              icon={CircleAlert}
              size={SmartyIconSize.Small}
              color={core.accent.coral[800]}
            />
            <SmartyText
              testID="text-input-error-text"
              className="smarty-mx-s smarty-caption-l text-foreground-warning">
              {error}
            </SmartyText>
          </View>
        )}
      </View>
    );
  },
);
