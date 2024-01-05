using { sap.capire.incidents as my } from '../db/schema';
using { API_BUSINESS_PARTNER as S4 } from './external/API_BUSINESS_PARTNER';
using from './processor-service';

extend service ProcessorService {
  entity BusinessPartner as projection on S4.A_BusinessPartner {
    key BusinessPartner as ID,
    FirstName as firstName,
    LastName as lastName,
    BusinessPartnerName as name,
    to_BusinessPartnerAddress as addresses
  }
  entity BusinessPartnerAddress as projection on S4.A_BusinessPartnerAddress {
            BusinessPartner as ID,
            AddressID as addressId,
            to_EmailAddress as email,
            to_PhoneNumber as phoneNumber
  }
  entity EmailAddress as projection on S4.A_AddressEmailAddress {
      key AddressID as addressId,
      EmailAddress as email
  }

  entity PhoneNumber as projection on S4.A_AddressPhoneNumber {
      key AddressID as addressId,
      PhoneNumber as phone
  }
}