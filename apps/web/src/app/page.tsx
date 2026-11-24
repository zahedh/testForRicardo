import {redirect} from 'next/navigation';

/**
 * Sends the root URL to the account page.
 */
export default function Index(): never {
  redirect('/dashboard/account');
}
