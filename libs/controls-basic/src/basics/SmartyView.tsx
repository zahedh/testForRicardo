import React from 'react';
import {View, ViewProps} from 'react-native';

export interface SmartyViewProps extends ViewProps {
  testID: string;
}

/**
 * A wrapper around View that adds custom props as needed.
 *
 * @param props - Component props {@link SmartyViewProps}.
 * @returns A React element.
 */
export function SmartyView(props: SmartyViewProps): React.JSX.Element {
  const {testID, ...rest} = props;
  return (
    <View testID={testID} data-testid={testID} {...rest}>
      {props.children}
    </View>
  );
}
