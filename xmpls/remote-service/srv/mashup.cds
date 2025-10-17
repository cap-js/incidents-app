// REVISIT: This is not in line with our best practices.
using {API_BUSINESS_PARTNER as S4} from './external/API_BUSINESS_PARTNER';

context RemoteService {

  entity BusinessPartner as projection on S4.A_BusinessPartner {

    key BusinessPartner     as ID,
        FirstName           as firstName,
        LastName            as lastName,
        BusinessPartnerName as name,
        to_BusinessPartnerAddress as addresses {
          BusinessPartner as ID,
          AddressID       as addressId,
          to_EmailAddress as email {
            AddressID    as addressId,
            EmailAddress as email
          },
          to_PhoneNumber  as phoneNumber {
            AddressID   as addressId,
            PhoneNumber as phone
          }
        }

  }
}
