/**
 * @author Prakhar Richhariya <prakhar.richhariya@314ecorp.com>
 * @description Typing file for contacts
 */

declare namespace ContactNS {
  interface IContact {
    address_line_1: string;
    address_line_2: string;
    city: string;
    code: string;
    company_name: string;
    country: string;
    created: string;
    currency: string;
    email: string;
    first_name: string;
    id: number;
    last_name: string;
    notes: string;
    payment_terms: string;
    phone: string;
    pincode: string;
    state: string;
    updated: string;
  }

  interface IOptions {
    label: string;
    value: string;
    key: string;
  }
}
