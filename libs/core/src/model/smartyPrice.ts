import Big from 'big.js';

export type Currency = 'GBP' | 'EUR' | 'USD';

export interface PriceValue {
  value: number;
  currency: Currency;
}

export class SmartyPrice {
  priceValue: PriceValue = {
    value: 0,
    currency: 'GBP',
  };

  /**
   * Constructor
   *
   * @param priceValue - Price value
   */
  constructor(priceValue: PriceValue = {value: 0, currency: 'GBP'}) {
    this.priceValue = priceValue;
  }

  /**
   * Formats the price value according to the provided options.
   *
   * @param {boolean} [showPence] - Whether to show pence (default: false).
   * @param {boolean} [formatAsPence] - Whether to format as pence (default: false).
   * @returns {string} The formatted price string.
   */
  public formatPrice(showPence?: boolean, formatAsPence?: boolean): string {
    if (formatAsPence) {
      return this.formatPriceAsPenceOrPound();
    }

    const finalValue = showPence
      ? this.priceValue.value.toFixed(2)
      : this.priceValue.value.toFixed(2).replace(/\.00$/, '');
    // Ensure that minus signs precede a leading currency symbol.
    const prependMinus = this.priceValue.value < 0 ? '-' : '';
    const absFinalValue = finalValue.replace('-', '');

    switch (this.priceValue.currency) {
      case 'GBP':
        return `${prependMinus}£${absFinalValue}`;
      case 'EUR':
        return `${finalValue}€`;
      case 'USD':
        return `${prependMinus}$${absFinalValue}`;
      default:
        return `${finalValue} ${this.priceValue.currency}`;
    }
  }

  /**
   * Formats the price value as either pence or pounds.
   *
   * @returns {string} The formatted price string
   */
  public formatPriceAsPenceOrPound(): string {
    const price = Big(this.priceValue.value).round(2, Big.roundHalfUp);
    const absPrice = price.abs();

    if (absPrice.lt(1)) {
      return `${price.lt(0) ? '-' : ''}${absPrice.mul(100).round(0, Big.roundHalfUp)}p`;
    }
    return `${price.lt(0) ? '-' : ''}£${absPrice.toFixed(2).replace(/\.00$/, '')}`;
  }

  /**
   * Check if the price value is above zero
   *
   * @returns true if the price value is above zero
   */
  public isPriceNonZero(): boolean {
    return this.priceValue.value > 0;
  }
}
