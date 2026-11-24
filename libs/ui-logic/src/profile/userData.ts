import {useGetUserDetails} from '@smarty-app/api-controller';

export interface PersonalDetailsUIData {
  fullName: string;
  email: string;
}

/**
 * Hook to get the personal details UI data for the current user.
 * Used for populating the personal details section of the profile screen.
 *
 * @returns PersonalDetailsUIData object.
 */
export function usePersonalDetailsUIData(): PersonalDetailsUIData {
  const {data: userDetails} = useGetUserDetails();
  if (userDetails) {
    return {
      fullName: `${userDetails.firstNames || ''} ${userDetails.surname || ''}`,
      email: userDetails.email || 'example@example.com',
    };
  } else {
    return {
      fullName: '',
      email: '',
    };
  }
}
