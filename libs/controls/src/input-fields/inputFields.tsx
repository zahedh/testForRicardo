import {Eye, EyeOff} from '@smarty-app/assets';
import {
  SmartyIcon,
  SmartyIconSize,
  SmartyPressable,
  SmartyStandardField,
  SmartyStandardFieldProps,
  SmartyText,
} from '@smarty-app/controls-basic';
import {
  DateFormat,
  DateInputError,
  formatDateInput,
  getDateInputError,
} from '@smarty-app/core';
import {core} from '@smarty-app/design-tokens';
import {en} from '@smarty-app/language';
import React, {JSX, useCallback, useMemo, useState} from 'react';
import {TextInput, TextInputProps, View} from 'react-native';

type SmartyEmailInputProps = {
  style?: string;
  title?: string;
  supportingText?: string;
  error?: string;
  disabled?: boolean;
} & TextInputProps;

export const SmartyEmailInput = React.forwardRef(
  (
    props: SmartyEmailInputProps,
    ref: React.ForwardedRef<TextInput>,
  ): JSX.Element => {
    const {
      style,
      title,
      error,
      onChangeText,
      importantForAutofill,
      value,
      ...rest
    } = props;
    return (
      <SmartyStandardField
        ref={ref}
        style={style}
        title={title ? title : en.emailAddress}
        autoCapitalize={'none'}
        keyboardType="email-address"
        textContentType="emailAddress"
        inputMode="email"
        autoComplete="email"
        importantForAutofill={importantForAutofill}
        error={error}
        autoCorrect={false}
        value={value || ''}
        onChangeText={onChangeText}
        returnKeyType="next"
        disabled={props.disabled}
        {...rest}
      />
    );
  },
);

type SmartyPasswordInputProps = {
  style?: string;
  title?: string;
  supportingText?: string;
  error?: string;
  showLengthValidation?: boolean;
  testID?: string;
} & TextInputProps;

export const SmartyPasswordInput = React.forwardRef(
  (
    props: SmartyPasswordInputProps,
    ref: React.ForwardedRef<TextInput>,
  ): JSX.Element => {
    const {
      style,
      title,
      error,
      value,
      onChangeText,
      importantForAutofill,
      showLengthValidation,
      testID = 'password-input',
      ...rest
    } = props;
    const [secureTextEntry, setSecureTextEntry] = useState<boolean>(true);

    const validationError = useMemo(() => {
      if (showLengthValidation && value && value.length < 8) {
        return en.passwordValidationRuleError;
      }
      if (error) {
        return error;
      }

      return undefined;
    }, [error, showLengthValidation, value]);

    return (
      <SmartyStandardField
        testID={testID}
        style={style}
        ref={ref}
        title={title ? title : en.password}
        onChangeText={onChangeText}
        secureTextEntry={secureTextEntry}
        error={validationError}
        value={value ?? ''}
        textContentType="password"
        autoComplete="password"
        autoCapitalize="none"
        autoCorrect={false}
        importantForAutofill={importantForAutofill}
        showClearText={false}
        rightChild={
          value && value.length > 0 ? (
            <View className="justify-center">
              <SmartyIcon
                icon={secureTextEntry ? EyeOff : Eye}
                size={SmartyIconSize.Medium}
                color={core.brand.white[0]}
              />
            </View>
          ) : null
        }
        {...rest}>
        {value && value.length > 0 ? (
          <View className="flex-row flex-1 items-center justify-between">
            <View className="flex-1" />
            <SmartyPressable
              testID="toggle-visible-password-button"
              accessibilityLabel={
                secureTextEntry ? en.showPassword : en.hidePassword
              }
              onPress={() => setSecureTextEntry((e) => !e)}>
              <SmartyText className="smarty-cta-m text-foreground-accent">
                {secureTextEntry ? en.showPassword : en.hidePassword}
              </SmartyText>
            </SmartyPressable>
          </View>
        ) : null}
      </SmartyStandardField>
    );
  },
);

type SmartyComboBoxInputProps = {
  inputFieldRef: React.RefObject<TextInput | null>;
  searchText: string;
  style?: string;
  title?: string;
  onChangeText: (text: string) => void;
  overrideOnClearText?: () => void;
  options?: string[];
  onOptionSelected?: (index: number) => void;
} & TextInputProps;

/**
 * A combo box input field that allows users to type in a search query and select from a list of options.
 *
 * @param props - The properties for the combo box input field.
 * @returns A JSX element representing the combo box input field.
 */
export function SmartyComboBoxInput(
  props: SmartyComboBoxInputProps,
): JSX.Element {
  const {
    style,
    onChangeText,
    overrideOnClearText,
    searchText,
    inputFieldRef,
    options,
    ...rest
  } = props;

  return (
    <View>
      <SmartyStandardField
        ref={inputFieldRef}
        style={style}
        title={en.changeAddressTextInput}
        autoCapitalize={'words'}
        keyboardType="default"
        autoComplete="off"
        autoCorrect={false}
        returnKeyType="done"
        textContentType="postalCode"
        spellCheck={false}
        onChangeText={onChangeText}
        value={searchText}
        overrideOnClearText={overrideOnClearText}
        {...rest}
      />
      {options && options.length > 0 && (
        <View className="bg-background-tertiary smarty-rounded-l smarty-mt-m border-stroke-medium border-2">
          {options.map((option, index) => (
            <SmartyPressable
              key={index}
              onPress={() => {
                if (props.onOptionSelected) {
                  props.onOptionSelected(index);
                }
              }}>
              <SmartyText className="smarty-px-l smarty-py-l font-theme-bold smarty-body-m">
                {option}
              </SmartyText>
            </SmartyPressable>
          ))}
        </View>
      )}
    </View>
  );
}

/**
 * A multiline text input component that uses the SmartyStandardField component.
 *
 * @param props - Props for the SmartyStandardField component.
 * @returns A JSX element representing the multiline text input.
 */
export function SmartyMultilineTextInput(
  props: SmartyStandardFieldProps,
): JSX.Element {
  const {className, multiline, ...rest} = props;
  return (
    <SmartyStandardField className={className} multiline={true} {...rest} />
  );
}

type SmartyDateInputProps = {
  inputRef?: React.ForwardedRef<TextInput>;
  title?: string;
  placeholder?: string;
  supportingText?: string;
  error?: string;
  value: string;
  onChangeText: (text: string) => void;
} & TextInputProps;

function mapDateInputErrorToString(
  error: DateInputError | undefined,
): string | undefined {
  switch (error) {
    case DateInputError.INVALID_DAY:
      return en.dateInputInvalidDay;
    case DateInputError.INVALID_MONTH:
      return en.dateInputInvalidMonth;
    case DateInputError.INVALID_DATE:
      return en.dateInputInvalidDate;
    case DateInputError.INVALID_YEAR:
      return en.dateInputInvalidYear;
    default:
      return undefined;
  }
}

/**
 * A component that renders a date input field.
 *
 * @param props - The properties for the date input field.
 * @returns the JSX element.
 */
export function SmartyDateInput(props: SmartyDateInputProps): JSX.Element {
  const {
    inputRef,
    title,
    placeholder,
    supportingText,
    error,
    value,
    onChangeText,
    ...rest
  } = props;

  const handleChangeText = useCallback(
    (text: string) => {
      onChangeText(formatDateInput(text));
    },
    [onChangeText],
  );

  // A parent-provided error takes precedence over the built-in bounds check.
  const dateInputError = getDateInputError(value);
  const resolvedError = error || mapDateInputErrorToString(dateInputError);

  return (
    <SmartyStandardField
      ref={inputRef}
      title={title}
      inputMode="numeric"
      keyboardType="number-pad"
      autoComplete="off"
      autoCorrect={false}
      textContentType="dateTime"
      spellCheck={false}
      maxLength={10}
      onChangeText={handleChangeText}
      value={value}
      supportingText={supportingText}
      error={resolvedError}
      placeholder={placeholder || DateFormat.ShortDate}
      {...rest}
    />
  );
}
