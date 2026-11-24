import {SmartyTopBar, SmartyTopBarOptions} from '@smarty-app/controls';
import {BackButtonType} from '@smarty-app/core';
import {useOnBackNavigation} from '@smarty-app/ui-navigation';
import {JSX} from 'react';
import {ViewProps} from 'react-native';

interface StackRootViewProps extends ViewProps {
  topBarOptions: SmartyTopBarOptions;
}

/**
 * Basic root view for web pages that contain a {@link SmartyTopBar}.
 *
 * @param props Component props.
 * @returns A React element.
 */
export default function StackRootView(props: StackRootViewProps): JSX.Element {
  const {children, topBarOptions} = props;
  const onBackDefault = useOnBackNavigation();

  return (
    <section>
      <SmartyTopBar
        {...topBarOptions}
        // Caller has to explicitly pass None to remove the back button.
        goBack={
          topBarOptions.backButtonType === BackButtonType.None
            ? undefined
            : (topBarOptions.goBack ?? onBackDefault)
        }
      />
      {children}
    </section>
  );
}
