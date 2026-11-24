import {ArrowRight, ChevronRight, X} from '@smarty-app/assets';
import {semantic} from '@smarty-app/design-tokens';
import {en} from '@smarty-app/language';
import {useOnResolveThemeColor} from '@smarty-app/util-generic';
import React, {JSX, useCallback, useMemo, useState} from 'react';
import {
  ActivityIndicator,
  Platform,
  Pressable,
  PressableProps,
  View,
  ViewProps,
} from 'react-native';

import {SmartyText} from '../basics/SmartyText';
import {cn} from '../classNameUtil';
import {SmartyIcon, SmartyIconSize} from '../icon/SmartyIcon';
import {SmartyLoadingBorder} from './SmartyLoadingBorder';

const WEB = Platform.OS === 'web';
/**
 * For web, we need pointer events to be auto so that the hover state works.
 * For mobile, we need pointer events to be none so that the pressable works.
 */
const POINTER_EVENTS = WEB ? 'auto' : 'none';

interface TintOverlayViewProps extends ViewProps {
  pressed: boolean;
  disabled: boolean;
}

/**
 * Renders the tint overlay shown on top of a pressable based on its pressed and disabled states.
 *
 * @param props - Component props.
 * @param props.className - Additional class names for the overlay view.
 * @param props.pressed - Whether the pressable is currently pressed.
 * @param props.disabled - Whether the pressable is currently disabled.
 * @returns A React element, or `null` when disabled.
 */
function TintOverlayView({
  pressed,
  disabled,
  className,
  ...props
}: TintOverlayViewProps): JSX.Element | null {
  return useMemo(() => {
    if (disabled) {
      return null;
    }
    if (WEB) {
      return (
        <View
          {...props}
          className={cn(
            'absolute h-full w-full',
            pressed ? 'bg-[#E4F5F2]/20' : 'hover:bg-[#E4F5F2]/10',
            className ?? 'smarty-rounded-l',
          )}
        />
      );
    } else {
      return (
        <View
          {...props}
          className={cn(
            'absolute h-full w-full',
            pressed && 'bg-brand-teal-100 opacity-20',
            className ?? 'smarty-rounded-l',
          )}
        />
      );
    }
  }, [disabled, props, pressed, className]);
}

/**
 * A pressable component that can be used to wrap other components and make them pressable
 * with standard Smarty styles and animations.
 *
 * @param props - Pressable props.
 * @returns A React element.
 */
export function SmartyPressable(props: SmartyPressableProps): JSX.Element {
  const {
    ref,
    className,
    children,
    onPress,
    accessibilityLabel,
    testID,
    disabled,
    hitSlop,
    accessible,
    accessibilityState,
    accessibilityRole,
    overlayClassName,
    isLoading,
    ...pressableProps
  } = props;

  const [layout, setLayout] = useState({width: 0, height: 0});

  const isDisabled = useMemo(
    () => Boolean(disabled || isLoading),
    [disabled, isLoading],
  );

  return (
    <Pressable
      ref={ref}
      {...pressableProps}
      testID={testID}
      data-testid={testID}
      disabled={isDisabled}
      onPress={onPress}
      className={cn(className, 'overflow-hidden')}
      accessible={accessible ?? true}
      accessibilityRole={accessibilityRole ?? 'button'}
      accessibilityLabel={accessibilityLabel}
      accessibilityState={accessibilityState}
      hitSlop={hitSlop}>
      {({pressed}) => (
        <View onLayout={(event) => setLayout(event.nativeEvent.layout)}>
          {typeof children === 'function' ? (
            // Custom callback to create children.
            children({pressed})
          ) : (
            // Default implementation with ReactNode children.
            <View>
              {children}
              <TintOverlayView
                className={overlayClassName}
                pressed={pressed}
                disabled={isDisabled}
              />
            </View>
          )}

          {isLoading && (
            <SmartyLoadingBorder width={layout.width} height={layout.height} />
          )}
        </View>
      )}
    </Pressable>
  );
}

export type SmartyPressableProps = {
  /** Reference to the underlying native View component. */
  ref?: React.ForwardedRef<View>;
  className?: string;
  textClassName?: string;
  borderClassName?: string;
  overlayClassName?: string;
  childrenTestID?: string;
  isLoading?: boolean;
} & PressableProps;

/**
 * Wrapper around Pressable with our primary button appearance.
 *
 * @param {SmartyPressableProps} props - Button props.
 */
export const SmartyPrimaryButton = React.forwardRef(
  (
    props: SmartyPressableProps,
    ref?: React.ForwardedRef<View>,
  ): JSX.Element => {
    const {
      testID,
      className,
      childrenTestID,
      children,
      disabled,
      onPress,
      textClassName,
      isLoading,
      ...rest
    } = props;

    const isDisabled = useMemo(
      () => Boolean(disabled || isLoading),
      [disabled, isLoading],
    );

    const renderContent = useCallback(
      ({pressed}: {pressed: boolean}) => (
        <View
          className={cn(
            `border-2 smarty-rounded-l w-full overflow-hidden`,
            isDisabled
              ? 'bg-background-tertiary border-background-tertiary'
              : 'bg-background-accent border-background-accent',
          )}>
          <View
            pointerEvents={POINTER_EVENTS}
            testID={childrenTestID}
            className={cn(isDisabled && 'opacity-disabled')}>
            <SmartyText
              className={cn(
                `text-center smarty-cta-m py-4`,
                isDisabled
                  ? `text-foreground-primary`
                  : `text-foreground-tertiary`,
                textClassName && textClassName,
              )}>
              {children as React.ReactNode}
            </SmartyText>
            {/* Overlay to show different levels of opacity when pressed or hovered */}
            <TintOverlayView pressed={pressed} disabled={isDisabled} />
          </View>
        </View>
      ),
      [childrenTestID, isDisabled, textClassName, children],
    );

    return (
      <View ref={ref} className={className}>
        <SmartyPressable
          testID={testID}
          disabled={disabled}
          onPress={!disabled ? onPress : undefined}
          isLoading={isLoading}
          {...rest}>
          {renderContent}
        </SmartyPressable>
      </View>
    );
  },
);

type SmartySecondaryButtonProps = {
  background?: 'primary' | 'tertiary';
} & SmartyPressableProps;

/**
 * Wrapper around Pressable with our secondary button appearance.
 *
 * @param {SmartyPressableProps} props - Button props.
 * @returns A React element.
 */
export const SmartySecondaryButton = React.forwardRef(
  (
    props: SmartySecondaryButtonProps,
    ref: React.ForwardedRef<View>,
  ): JSX.Element => {
    const {
      testID,
      className,
      childrenTestID,
      children,
      disabled,
      onPress,
      borderClassName,
      textClassName,
      isLoading,
      background,
      ...rest
    } = props;

    const isDisabled = useMemo(
      () => Boolean(disabled || isLoading),
      [disabled, isLoading],
    );

    const renderContent = useCallback(
      ({pressed}: {pressed: boolean}) => (
        <View
          className={cn(
            `border-2 smarty-rounded-l w-full overflow-hidden`,
            background === 'tertiary'
              ? 'bg-background-tertiary'
              : 'bg-background-primary',
            isDisabled
              ? 'border-foreground-secondary'
              : 'border-foreground-primary',
            borderClassName && borderClassName,
          )}>
          <View
            pointerEvents={POINTER_EVENTS}
            testID={childrenTestID}
            className={cn(isDisabled && 'opacity-disabled')}>
            <SmartyText
              className={cn(
                `text-center smarty-cta-m py-4 text-foreground-primary`,
                textClassName && textClassName,
              )}>
              {children as React.ReactNode}
            </SmartyText>
            {/* Overlay to show different levels of opacity when pressed or hovered */}
            <TintOverlayView pressed={pressed} disabled={isDisabled} />
          </View>
        </View>
      ),
      [
        childrenTestID,
        isDisabled,
        background,
        borderClassName,
        textClassName,
        children,
      ],
    );

    return (
      <View ref={ref} className={className}>
        <SmartyPressable
          testID={testID}
          disabled={disabled}
          onPress={!disabled ? onPress : undefined}
          isLoading={isLoading}
          {...rest}>
          {renderContent}
        </SmartyPressable>
      </View>
    );
  },
);

type SmartyTertiaryButtonProps = {
  icon?: JSX.Element;
  background?: 'primary' | 'secondary' | 'tertiary';
} & PressableProps &
  SmartyPressableProps;

/**
 * Wrapper around Pressable with our tertiary button appearance.
 *
 * @param {SmartyTertiaryButtonProps} props - Button props.
 * @returns A React element.
 */
export const SmartyTertiaryButton = React.forwardRef(
  (
    props: SmartyTertiaryButtonProps,
    ref: React.ForwardedRef<View>,
  ): JSX.Element => {
    const {
      testID,
      className,
      childrenTestID,
      children,
      disabled,
      onPress,
      icon,
      textClassName,
      background,
      ...rest
    } = props;

    const backgroundClassName = useMemo(() => {
      switch (background) {
        case 'secondary':
          return 'bg-background-secondary border-background-secondary';
        case 'tertiary':
          return 'bg-background-tertiary border-background-tertiary';
        case 'primary':
        default:
          return 'bg-background-primary border-background-primary';
      }
    }, [background]);

    const renderContent = useCallback(
      ({pressed}: {pressed: boolean}) => (
        <View
          className={cn(
            `border-2 smarty-rounded-l w-full overflow-hidden`,
            backgroundClassName,
          )}>
          <View
            pointerEvents={POINTER_EVENTS}
            testID={childrenTestID}
            className={cn(disabled && 'opacity-disabled')}>
            <SmartyText
              className={cn(
                `text-center smarty-cta-m py-4 text-foreground-accent`,
                textClassName && textClassName,
              )}>
              {children as React.ReactNode}
            </SmartyText>
            {/* Overlay to show different levels of opacity when pressed or hovered */}
            <TintOverlayView pressed={pressed} disabled={Boolean(disabled)} />
          </View>
        </View>
      ),
      [childrenTestID, disabled, textClassName, backgroundClassName, children],
    );

    return (
      <View ref={ref} className={className}>
        <SmartyPressable
          testID={testID}
          disabled={disabled}
          onPress={!disabled ? onPress : undefined}
          {...rest}>
          {renderContent}
        </SmartyPressable>
      </View>
    );
  },
);

/**
 * Inline call-to-action link: accent text with a trailing chevron. Underlined
 * while hovered or pressed; faded, and never underlined, when disabled.
 *
 * @param {SmartyPressableProps} props - Button props.
 * @returns A React element.
 */
export const SmartyCallToAction = React.forwardRef(
  (props: SmartyPressableProps, ref: React.ForwardedRef<View>): JSX.Element => {
    const {
      testID,
      className,
      childrenTestID,
      children,
      disabled,
      onPress,
      onHoverIn,
      onHoverOut,
      textClassName,
      ...rest
    } = props;
    const [hovered, setHovered] = useState(false);

    const onHoverInFinal = useCallback<
      NonNullable<PressableProps['onHoverIn']>
    >(
      (event) => {
        setHovered(true);
        onHoverIn?.(event);
      },
      [onHoverIn],
    );

    const onHoverOutFinal = useCallback<
      NonNullable<PressableProps['onHoverOut']>
    >(
      (event) => {
        setHovered(false);
        onHoverOut?.(event);
      },
      [onHoverOut],
    );

    const renderContent = useCallback(
      ({pressed}: {pressed: boolean}) => {
        const isUnderlined = !disabled && (pressed || hovered);

        return (
          <View
            pointerEvents={POINTER_EVENTS}
            testID={childrenTestID}
            className={cn(
              // The underline spans the text and chevron, so it is a bottom border on the row.
              // It stays in place, transparent, so showing it does not shift the layout.
              'flex-row items-center smarty-gap-x-xs border-b',
              isUnderlined ? 'border-foreground-accent' : 'border-transparent',
              disabled && 'opacity-disabled',
            )}>
            <SmartyText
              className={cn(
                'smarty-cta-m text-foreground-accent',
                textClassName && textClassName,
              )}>
              {children as React.ReactNode}
            </SmartyText>
            <SmartyIcon icon={ChevronRight} size={SmartyIconSize.Small} />
          </View>
        );
      },
      [childrenTestID, disabled, hovered, textClassName, children],
    );

    return (
      <View ref={ref} className={cn('self-start', className)}>
        <SmartyPressable
          testID={testID}
          disabled={disabled}
          onPress={!disabled ? onPress : undefined}
          onHoverIn={onHoverInFinal}
          onHoverOut={onHoverOutFinal}
          {...rest}>
          {renderContent}
        </SmartyPressable>
      </View>
    );
  },
);

SmartyCallToAction.displayName = 'SmartyCallToAction';

type SmartyCardButtonProps = {
  showArrow?: boolean;
  children?: React.ReactNode;
} & SmartyPressableProps;

/**
 * Wrapper around Pressable with our card button appearance.
 *
 * @param showArrow - Show arrow
 * @param children - ReactNode
 * @returns A React element.
 */
export const SmartyCardButton = React.forwardRef(
  (
    props: SmartyCardButtonProps,
    ref: React.ForwardedRef<View>,
  ): JSX.Element => {
    const {className, children, disabled, onPress, showArrow, ...rest} = props;
    const onResolveThemeColor = useOnResolveThemeColor();

    return (
      <View ref={ref} className={className}>
        <SmartyPressable onPress={onPress} className={'pt-2.5'} {...rest}>
          <View className={'flex flex-row justify-start items-center'}>
            <SmartyText className={'smarty-cta-s text-foreground-primary'}>
              {children as React.ReactNode}
            </SmartyText>
            {showArrow === true && (
              <View className={'ml-1.5'}>
                <SmartyIcon
                  icon={ArrowRight}
                  size={SmartyIconSize.Small}
                  color={onResolveThemeColor(semantic.foreground.primary)}
                />
              </View>
            )}
          </View>
        </SmartyPressable>
      </View>
    );
  },
);

//When you use React.forwardRef to create a component, React loses the component's name in debugging tools like React DevTools. Instead of seeing "SmartyCardButton" in the component tree, you'd see "Anonymous" or "ForwardRef".
SmartyCardButton.displayName = 'SmartyCardButton';

/**
 * Dismiss button component. Circle with an X icon.
 *
 * @param props - PressableProps, plus `isLoading` and `showBackground`.
 * @param props.isLoading Whether to show a loading spinner instead of the dismiss icon.
 * @param props.showBackground Whether to show the circular background fill. Defaults to false.
 * @returns A React element.
 */
export function SmartyDismissButton(
  props: PressableProps & {isLoading?: boolean; showBackground?: boolean},
): JSX.Element {
  const {className, onPress, isLoading, showBackground, hitSlop, ...rest} =
    props;
  const onResolveThemeColor = useOnResolveThemeColor();
  return (
    <SmartyPressable
      accessibilityLabel={en.accessibilityDismiss}
      className={cn(
        `rounded-full h-6 w-6`,
        // showBackground needs to be explicitly set to true in order to appear (as default is off in designs).
        showBackground === true && 'bg-background-primary',
        className,
      )}
      onPress={onPress}
      hitSlop={hitSlop ?? 6} // Button is 24x24 pixels (h-6 w-6). hitSlop=6 on all sides results in a 36x36 pixel touch area.
      {...rest}>
      <View className={`h-full w-full justify-center items-center`}>
        {isLoading ? (
          <ActivityIndicator />
        ) : (
          <SmartyIcon
            icon={X}
            size={SmartyIconSize.Small}
            color={onResolveThemeColor(semantic.foreground.primary)}
          />
        )}
      </View>
    </SmartyPressable>
  );
}
