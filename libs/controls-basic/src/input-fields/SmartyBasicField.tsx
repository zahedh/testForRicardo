'use client';
import {X} from '@smarty-app/assets';
import {core, semantic} from '@smarty-app/design-tokens';
import {
  useOnResolveThemeColor,
  useScaledFontSize,
} from '@smarty-app/util-generic';
import React, {JSX, useCallback, useEffect, useMemo, useState} from 'react';
import {
  FocusEvent,
  Platform,
  TextInput,
  TextInputProps,
  View,
} from 'react-native';

import {SmartyPressable} from '../buttons/Buttons';
import {cn} from '../classNameUtil';
import {SmartyIcon, SmartyIconSize} from '../icon/SmartyIcon';

type SmartyBasicFieldProps = {
  className?: string;
  value: string;
  error?: boolean;
  monoFont?: boolean;
  leftChild?: React.ReactNode;
  rightChild?: React.ReactNode;
  showClearText?: boolean;
  overrideOnClearText?: () => void;
  disabled?: boolean;
} & TextInputProps;

export const SmartyBasicField = React.forwardRef(
  (
    props: SmartyBasicFieldProps,
    ref: React.ForwardedRef<TextInput>,
  ): JSX.Element => {
    const {
      testID,
      className,
      error,
      monoFont,
      leftChild,
      rightChild,
      showClearText = true,
      overrideOnClearText,
      value,
      disabled,
      multiline,
      ...rest
    } = props;
    const [isFocused, setIsFocused] = useState<boolean>(false);

    const onResolveThemeColor = useOnResolveThemeColor();

    const {style: textInputStyle, maxScale} = useScaledFontSize({
      className: 'smarty-body-m',
    });

    const onClearText = useCallback(() => {
      if (props.onChangeText) {
        props.onChangeText('');
      }
    }, [props]);

    const onFocus = useCallback(
      (e: FocusEvent) => {
        if (!disabled) {
          setIsFocused(true);
        }
        props.onFocus && props.onFocus(e);
      },
      [disabled, props],
    );

    const onBlur = useCallback(
      (e: FocusEvent) => {
        setIsFocused(false);
        props.onBlur && props.onBlur(e);
      },
      [props],
    );

    useEffect(() => {
      if (disabled) {
        setIsFocused(false);
      }
    }, [disabled]);

    const resolvedCursorColor = useMemo(() => {
      if (error) {
        return onResolveThemeColor(semantic.foreground.warning);
      }
      return onResolveThemeColor(semantic.foreground.accent);
    }, [error, onResolveThemeColor]);

    const borderClass = useMemo(() => {
      if (disabled) {
        return `border-transparent`;
      }
      if (error === true) {
        return `border-foreground-warning`;
      }
      if (isFocused) {
        return `border-foreground-accent`;
      }
      return `border-stroke-medium`;
    }, [disabled, error, isFocused]);

    return (
      <View className={className}>
        <View
          testID="text-input-border-view"
          className={`flex-row smarty-rounded-l smarty-px-l border-2 bg-background-secondary ${borderClass} ${multiline ? 'min-h-40 max-h-60 smarty-py-m' : 'h-20'}`}>
          {leftChild}
          <TextInput
            testID={testID ? testID : 'smarty-text-input'}
            ref={ref}
            className={cn(
              `flex-1 focus:outline-none`,
              value.length > 0 ? 'font-theme-bold' : 'font-theme',
              disabled
                ? 'text-foreground-secondary'
                : 'text-foreground-primary',
            )}
            autoCorrect={props.autoCorrect}
            placeholderTextColor={onResolveThemeColor(
              semantic.foreground.secondary,
            )}
            onKeyPress={props.onKeyPress}
            onChangeText={props.onChangeText}
            onSubmitEditing={error ? undefined : props.onSubmitEditing}
            value={value}
            selectionColor={resolvedCursorColor}
            cursorColor={resolvedCursorColor}
            maxFontSizeMultiplier={maxScale}
            focusable={!disabled}
            editable={!disabled}
            pointerEvents={disabled ? 'none' : 'auto'}
            multiline={multiline}
            {...rest}
            style={{
              fontSize: textInputStyle.fontSize,
              ...(monoFont
                ? {
                    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
                    letterSpacing: 4,
                    lineHeight: textInputStyle.lineHeight,
                  }
                : {}),
              ...(Platform.OS === 'web'
                ? {caretColor: resolvedCursorColor}
                : {}),
            }}
            onFocus={onFocus}
            onBlur={onBlur}
          />

          {isFocused && value.length > 0 && showClearText && (
            <View
              className="justify-center"
              {...Platform.select({
                web: {onMouseDown: (e: Event) => e.preventDefault()},
                default: {},
              })}>
              <SmartyPressable
                testID={testID ? `${testID}-clear` : 'smarty-text-input-clear'}
                onPress={
                  overrideOnClearText ? overrideOnClearText : onClearText
                }>
                <SmartyIcon
                  icon={X}
                  size={SmartyIconSize.Medium}
                  color={core.brand.white[0]}
                />
              </SmartyPressable>
            </View>
          )}
          {rightChild}
        </View>
      </View>
    );
  },
);
