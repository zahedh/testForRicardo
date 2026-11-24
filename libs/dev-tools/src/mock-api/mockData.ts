import {EditSubscriber, Payment, Subscriber} from '@smarty-app/dx-api';

export const MOCK_SUBSCRIBER: Subscriber = {
  title: 'Ms',
  firstNames: 'Alex',
  surname: 'Taylor',
  dateOfBirth: '1990-04-12T00:00:00Z',
  email: 'alex.taylor@example.com',
  altContactNumber: '07700900123',
};

const MOCK_PAYMENT_COUNT = 100;

const PLANS: ReadonlyArray<{description: string; amount: number}> = [
  {description: 'Unlimited Data plan', amount: 20},
  {description: '30GB Data plan', amount: 10},
  {description: 'Data add-on 5GB', amount: 5},
  {description: 'International calling add-on', amount: 3.5},
];

/**
 * Builds a deterministic payment history, newest first, with a mix of statuses
 * so every row style shows up.
 *
 * @returns The mock payments.
 */
export function createMockPayments(): Payment[] {
  const now = Date.now();
  const payments: Payment[] = [];

  for (let i = 0; i < MOCK_PAYMENT_COUNT; i++) {
    const plan = PLANS[i % PLANS.length];
    const date = new Date(now - i * 9 * 24 * 60 * 60 * 1000);
    let status: Payment['status'] = 'PAID';
    if (i === 0) {
      status = 'PENDING';
    } else if (i % 11 === 3) {
      status = 'FAILED';
    } else if (i % 13 === 7) {
      status = 'REFUNDED';
    }

    payments.push({
      id: `mock-payment-${MOCK_PAYMENT_COUNT - i}`,
      paymentDate: date.toISOString(),
      amount: plan.amount,
      currency: 'GBP',
      description: plan.description,
      status,
    });
  }

  return payments;
}

/**
 * @param id - The new payment's id.
 * @returns A payment dated now, as if it had just been taken.
 */
export function createNewMockPayment(id: number): Payment {
  return {
    id: `mock-payment-new-${id}`,
    paymentDate: new Date().toISOString(),
    amount: 5,
    currency: 'GBP',
    description: 'Data add-on 5GB',
    status: 'PAID',
  };
}

/**
 * @param subscriber - The current subscriber.
 * @param edit - The fields to change.
 * @returns The subscriber with the edited fields applied.
 */
export function applySubscriberEdit(
  subscriber: Subscriber,
  edit: EditSubscriber,
): Subscriber {
  return {...subscriber, ...edit};
}
