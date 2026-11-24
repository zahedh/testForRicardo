import {Subscriber as SubscriberDto} from '@smarty-app/dx-api';
import {capitalize} from 'lodash';

import {User} from '../model/user';
import {mapDateStringToSmartyDate} from './utilMapper';

/**
 * Maps a Subscriber DTO from the API to a User model used in the app.
 * Handles optional fields and provides default values where necessary.
 *
 * @param dto - The Subscriber DTO to map.
 * @returns A User model.
 */
export function mapSubscriberDtoToUser(dto: SubscriberDto): User {
  return {
    title: capitalize(dto.title ?? ''),
    firstNames: dto.firstNames ?? '',
    surname: dto.surname ?? '',
    email: dto.email ?? '',
    contactPhoneNumber: dto.altContactNumber ?? '',
    dateOfBirth: mapDateStringToSmartyDate(dto.dateOfBirth),
  };
}
