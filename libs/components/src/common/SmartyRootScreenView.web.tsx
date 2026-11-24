import {cn, SmartyView} from '@smarty-app/controls-basic';
import {JSX} from 'react';
import {ViewProps} from 'react-native';

/**
 * SmartyRootScreenView - the main parent view for all screen views in the website.
 *
 * @param props - Component props
 * @returns JSX element
 */
export function SmartyRootScreenView(props: ViewProps): JSX.Element {
  const {children, testID, className, ...rest} = props;

  return (
    <SmartyView
      testID={testID ?? 'smarty-root-web-screen-view'}
      className={cn('flex-1 bg-background-primary', className)}
      {...rest}>
      {children}
    </SmartyView>
  );
}
