import React, {JSX} from 'react';
import {View, ViewProps} from 'react-native';

import {cn} from '../classNameUtil';

export const classNameRoundedCard =
  'px-4 py-4 bg-background-primary smarty-rounded-xl overflow-hidden';

export const classNameRoundedSecondaryCard =
  'px-4 py-4 bg-background-secondary smarty-rounded-xl overflow-hidden';

export const classNameContentCard =
  'smarty-p-l bg-background-secondary smarty-rounded-xl overflow-hidden';

type SmartyCardBaseProps = {
  className?: string;
  buttonTitle?: string;
  onButtonClick?: () => void;
  children?: React.ReactNode;
};

// there'll be a better way of doing this, revisit + refactor
type SmartyCardTopOrBottomElementProps =
  | {
      topElement: JSX.Element;
      bottomElement: JSX.Element;
      topClassName?: string;
      bottomClassName?: string;
    }
  | {
      topElement: JSX.Element;
      bottomElement?: undefined;
      topClassName?: string;
      bottomClassName?: undefined;
    }
  | {
      topElement?: undefined;
      bottomElement: JSX.Element;
      topClassName?: undefined;
      bottomClassName?: string;
    }
  | {
      topElement?: undefined;
      bottomElement?: undefined;
      topClassName?: undefined;
      bottomClassName?: string;
    };

export type SmartyCardProps = SmartyCardTopOrBottomElementProps &
  SmartyCardBaseProps &
  ViewProps;

/**
 * All purpose card component that can be used to display information.
 *
 * @example
 * <SmartyCard topElement={<View />} bottomElement={<View />} />
 * @param {SmartyCardProps} props - Card props
 * @param {string} props.className - className override
 * @param {string} props.buttonTitle - Button title
 * @param props.onButtonClick - Button press handler
 * @param JSX.Element props.topElement - Top element
 * @param JSX.Element props.bottomElement - Bottom element
 * @param {string} props.topClassName - Top element className override
 * @param {string} props.bottomClassName - Bottom element className override
 * @returns A React element.
 */
export const SmartyCard = React.forwardRef(
  (props: SmartyCardProps, ref: React.ForwardedRef<View>): JSX.Element => {
    const {
      className,
      buttonTitle,
      onButtonClick,
      topElement,
      bottomElement,
      topClassName,
      bottomClassName,
      ...rest
    } = props;
    return (
      <View ref={ref} className={cn(`flex-col`, className)} {...rest}>
        {topElement && (
          <View
            className={cn(
              classNameRoundedCard,
              !bottomElement ? 'rounded-b-xl' : 'rounded-b-0',
              topClassName && topClassName,
            )}>
            {topElement}
          </View>
        )}
        {bottomElement && (
          <View
            className={cn(
              classNameRoundedCard,
              !topElement ? 'rounded-t-xl' : 'rounded-t-0',
              bottomClassName && bottomClassName,
            )}>
            {bottomElement}
            {/*!!buttonTitle && ( // TODO: Restore this button.
              <SmartyCardButton showArrow={true} onPress={onButtonClick}>
                {buttonTitle}
              </SmartyCardButton>
            )*/}
          </View>
        )}
      </View>
    );
  },
);

//When you use React.forwardRef to create a component, React loses the component's name in debugging tools like React DevTools. Instead of seeing "SmartyCard" in the component tree, you'd see "Anonymous" or "ForwardRef".
SmartyCard.displayName = 'SmartyCard';

export const SmartyContentCard = React.forwardRef(
  (props: SmartyCardProps, ref: React.ForwardedRef<View>): JSX.Element => {
    const {className, children, ...restProps} = props;
    return (
      <View
        ref={ref}
        className={cn(classNameContentCard, `flex-col`, className)}
        {...restProps}>
        {children}
      </View>
    );
  },
);

//When you use React.forwardRef to create a component, React loses the component's name in debugging tools like React DevTools. Instead of seeing "SmartyContentCard" in the component tree, you'd see "Anonymous" or "ForwardRef".
SmartyContentCard.displayName = 'SmartyContentCard';
