import {cn, SmartyView} from '@smarty-app/controls-basic';
import {JSX} from 'react';
import {ViewProps} from 'react-native';

/**
 * SmartyRootScreenView - the main parent view for all screen views in the app.
 *
 * @param props - Component props
 * @returns JSX element
 */
export function SmartyRootScreenView(props: ViewProps): JSX.Element {
  const {children, testID, className, ...rest} = props;

  return (
    <SmartyView
      testID={testID ?? 'smarty-root-app-screen-view'}
      className={cn(
        'bg-background-primary smarty-rounded-2xl smarty-px-l smarty-py-l',
        className,
      )}
      {...rest}>
      {children}
    </SmartyView>
  );
}
