import {ReceiptText, UserCog} from '@smarty-app/assets';
import {
  SmartyActionList,
  SmartyActionListItemProps,
} from '@smarty-app/controls';
import {cn, SmartyIcon, SmartyIconSize} from '@smarty-app/controls-basic';
import {en} from '@smarty-app/language';
import {usePersonalDetailsUIData} from '@smarty-app/ui-logic';
import {
  useOnNavigateToEmailAddressEdit,
  useOnPaymentHistoryNavigation,
} from '@smarty-app/ui-navigation';
import {JSX, useMemo} from 'react';
import {View} from 'react-native';

interface YouMenuItemsProps {
  className?: string;
}

/**
 * Component that renders the main section of the "You" menu.
 *
 * This component uses several custom hooks to handle the press events of the menu items.
 * Each hook returns a callback function that is called when the corresponding menu item is pressed.
 *
 * @param props - The props of the component.
 * @returns A JSX element that represents the "You" section of the "You" menu.
 */
export function YouMainMenuItems(props: YouMenuItemsProps): JSX.Element {
  const {className} = props;

  const {fullName, email} = usePersonalDetailsUIData();
  const onEmailPress = useOnNavigateToEmailAddressEdit();
  const onPaymentHistoryPress = useOnPaymentHistoryNavigation();
  const iconSize = SmartyIconSize.Medium;

  const menuItems = useMemo(() => {
    const items: SmartyActionListItemProps[] = [];

    items.push({
      itemKey: 'email',
      testID: 'you-main-menu-email-button',
      leftChild: <SmartyIcon icon={UserCog} size={iconSize} />,
      title: en.personalDetailsEmailItemText,
      accessibilityLabel: en.personalDetailsEmailItemText,
      rightDetail: email,
      rightArrowShow: true,
      onPress: onEmailPress,
    });
    items.push({
      itemKey: 'paymentHistory',
      testID: 'you-main-menu-payment-history-button',
      leftChild: <SmartyIcon icon={ReceiptText} size={iconSize} />,
      title: en.paymentHistoryMenu,
      accessibilityLabel: en.paymentHistoryMenu,
      rightArrowShow: true,
      onPress: onPaymentHistoryPress,
    });

    return items;
  }, [email, iconSize, onEmailPress, onPaymentHistoryPress]);

  return (
    <View className={cn(`w-full`, className)}>
      <SmartyActionList title={fullName} items={menuItems} />
    </View>
  );
}
