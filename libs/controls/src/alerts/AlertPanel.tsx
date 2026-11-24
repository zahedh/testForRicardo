'use client';

import {
  Check,
  ChevronRight,
  CircleAlert,
  Lightbulb,
  TriangleAlert,
} from '@smarty-app/assets';
import {
  cn,
  SmartyDismissButton,
  SmartyIcon,
  SmartyIconSize,
  SmartyPressable,
  SmartyText,
} from '@smarty-app/controls-basic';
import {core, semantic} from '@smarty-app/design-tokens';
import {
  useOnResolveThemeColor,
  useResolveTailwindColorToHex,
} from '@smarty-app/util-generic';
import type {LucideIcon} from 'lucide-react-native';
import {JSX, ReactNode, useCallback, useMemo} from 'react';
import {Platform, View} from 'react-native';

const WEB = Platform.OS === 'web';

/**
 * The supported alert types for `SmartyAlertPanel`.
 */
export type SmartyAlertType =
  'information' | 'error' | 'warning' | 'success' | 'neutral';

export interface SmartyAlertPanelProps {
  className?: string;
  testID?: string;
  alertType: SmartyAlertType;
  background?: 'primary' | 'secondary' | 'tertiary';
  icon?: LucideIcon;
  alertTitle?: string;
  alertBodyText: string;
  onDismiss?: () => void;
  alertLinkText?: string;
  onAlertLinkPress?: () => void;
  extraContent?: ReactNode;
}

/**
 * A dismissible panel used to surface an alert (error, information, success, warning or neutral) with an
 * optional title, an optional dismiss button, and an optional call-to-action text link.
 *
 * @param props The alert panel props.
 * @param props.className NativeWind class names to override the panel container.
 * @param props.testID Test identifier for the panel root.
 * @param props.alertType The alert type - controls the icon and accent color used.
 * @param props.background The panel background. Defaults to tertiary.
 * @param props.icon Overrides the alert type's default icon. The colour still follows the alert type.
 * @param props.alertTitle The panel title. The title row is hidden entirely if not provided.
 * @param props.alertBodyText The panel body text, as plain text. Always shown.
 * @param props.onDismiss Callback for the dismiss (X) button. The button is hidden entirely if not provided.
 * @param props.alertLinkText The text link label shown at the bottom of the panel. Only shown if `onAlertLinkPress` is also provided.
 * @param props.onAlertLinkPress Callback for the text link at the bottom of the panel. The link is hidden entirely if `alertLinkText` is not also provided.
 * @param props.extraContent Optional extra content shown below the body text, for bodies that need more than a single paragraph.
 * @returns A React element.
 */
export function SmartyAlertPanel(props: SmartyAlertPanelProps): JSX.Element {
  const {
    className,
    testID = 'alert-panel',
    alertType,
    background = 'tertiary',
    icon,
    alertTitle,
    alertBodyText,
    onDismiss,
    alertLinkText,
    onAlertLinkPress,
    extraContent,
  } = props;

  const onResolveThemeColor = useOnResolveThemeColor();

  const alertIcon = useMemo(() => {
    switch (alertType) {
      case 'information':
        return (
          <SmartyIcon
            icon={icon ?? Lightbulb}
            size={SmartyIconSize.Small}
            color={core.brand.teal[800]}
          />
        );
      case 'error':
        return (
          <SmartyIcon
            icon={icon ?? CircleAlert}
            size={SmartyIconSize.Small}
            color={core.accent.coral[800]}
          />
        );
      case 'warning':
        return (
          <SmartyIcon
            icon={icon ?? TriangleAlert}
            size={SmartyIconSize.Small}
            color={core.accent.yellow[800]}
          />
        );
      case 'success':
        return (
          <SmartyIcon
            icon={icon ?? Check}
            size={SmartyIconSize.Small}
            color={core.brand.teal[800]}
          />
        );
      case 'neutral':
        return (
          <SmartyIcon
            icon={icon ?? CircleAlert}
            size={SmartyIconSize.Small}
            color={onResolveThemeColor(semantic.foreground.primary)}
          />
        );
      default:
        return null;
    }
  }, [alertType, icon, onResolveThemeColor]);

  const alertAccentColorClassName = useMemo(() => {
    switch (alertType) {
      case 'information':
        return 'text-foreground-accent';
      case 'error':
        return 'text-foreground-warning';
      case 'warning':
        return 'text-foreground-promo';
      case 'success':
        return 'text-foreground-accent';
      case 'neutral':
        return 'text-foreground-primary';
      default:
        return '';
    }
  }, [alertType]);

  const alertBackgroundColorClassName = useMemo(() => {
    switch (background) {
      case 'primary':
        return 'bg-background-primary';
      case 'secondary':
        return 'bg-background-secondary';
      case 'tertiary':
        return 'bg-background-tertiary';
    }
  }, [background]);

  const showLink = !!alertLinkText && !!onAlertLinkPress;

  const alertChevronColor = useResolveTailwindColorToHex(
    alertAccentColorClassName,
  );

  const renderLinkContent = useCallback(
    ({pressed}: {pressed: boolean}) => (
      <View className="flex-row items-center self-start">
        <SmartyText
          className={cn(
            'font-theme-bold smarty-cta-m',
            pressed
              ? 'text-brand-teal-100'
              : `${alertAccentColorClassName}${
                  WEB ? ' hover:text-foreground-primary' : ''
                }`,
          )}>
          {alertLinkText}
        </SmartyText>

        <SmartyIcon
          icon={ChevronRight}
          size={SmartyIconSize.Small}
          color={alertChevronColor ?? core.brand.white[0]}
        />
      </View>
    ),
    [alertAccentColorClassName, alertChevronColor, alertLinkText],
  );

  return (
    <View
      testID={testID}
      className={cn(
        'smarty-p-l smarty-rounded-xl overflow-hidden',
        alertBackgroundColorClassName,
        className,
      )}
      accessible={true}
      accessibilityRole="text"
      accessibilityLabel={alertTitle ?? alertBodyText}>
      <View className="flex-row items-start smarty-gap-m">
        <View className="h-6 w-6 items-center justify-center">{alertIcon}</View>
        <View className="flex-1 smarty-gap-m">
          {!!alertTitle && (
            <SmartyText
              testID="alert-panel-title"
              className={cn(
                'font-theme-bold smarty-body-m',
                alertAccentColorClassName,
              )}>
              {alertTitle}
            </SmartyText>
          )}
          <View testID="alert-panel-body">
            <SmartyText className="font-theme smarty-caption-l text-foreground-primary">
              {alertBodyText}
            </SmartyText>
          </View>
          {extraContent}
          {showLink && (
            <SmartyPressable
              testID="alert-panel-link"
              className="smarty-pt-s"
              onPress={onAlertLinkPress}
              accessibilityRole="link"
              accessibilityLabel={alertLinkText}>
              {renderLinkContent}
            </SmartyPressable>
          )}
        </View>
        {onDismiss && (
          <SmartyDismissButton
            testID="alert-dismiss-button"
            onPress={onDismiss}
            showBackground={false}
          />
        )}
      </View>
    </View>
  );
}
