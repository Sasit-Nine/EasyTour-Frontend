import { gql, useQuery } from '@apollo/client';

export const REGISTERMUTATION = gql`
mutation Register($input: UsersPermissionsRegisterInput!) {
  register(input: $input) {
    jwt
    user {
      username
      email
    }
  }
}
`;

export const LOGINMUTATION = gql`
mutation Mutation($input: UsersPermissionsLoginInput!) {
  login(input: $input) {
    jwt
  }
}
`;

// {
//     "input": {
//       "identifier": "customer1",
//       "password": "123456"
//     }
// }

export const QUERYUSERDATA = gql`
query Query {
  me {
    username
    role {
      name
    }
    email
    documentId
  }
}
`;

export const MUTATION_BOOKING = gql`
mutation CreateBooking($data: BookingInput!) {
  createBooking(data: $data) {
    address
    city
    customers {
      documentId
    }
    fname
    lname
    package {
      documentId
    }
    province
    quantity
    tel
    total_price
    district
    booking_status
    documentId
    booking_id
  }
}
`;

// {
//   "data": {
//     "total_price": 1500,
//     "customers": "xystgmikrrll3c13oh0xm6x3",
//     "package": "rahga1z5b8cdvw61cg2c6f04",
//     "quantity": 1,
//   }
// }

export const QUERY_PAYMENT_DATA = gql`
query Booking($documentId: ID!) {
  booking(documentId: $documentId) {
    payment_intent_id,
    client_secret
  }
}
`;

export const QUERY_PACKAGELIST = gql`
query Query($filters: PackageFiltersInput) {
  packages(filters: $filters) {
    name
    location {
      district
      province
      sector
    }
    price
    start
    end
    duration
    documentId
    image {
      previewUrl
      url
    }
    package_id
  }
}
`;

export const QUERY_PACKAGE = gql`
query Query($documentId: ID!) {
  package(documentId: $documentId) {
    name
    price
    image {
      url
    }
    start
    end
    max_people
    duration
    location {
      province
      google_place_id
      district
      sector
    }
    time
    note
    meeting_point
    rating
    package_details {
      name
      detail
    }
    description
  }
}`;

export const QUERY_PAYMENT_INTENT_ID = gql`
query Booking($documentId: ID!) {
  booking(documentId: $documentId) {
    payment_intent_id
  }
}
`;

export const QEURY_PROFILE = gql`
query Me($documentId: ID!) {
  usersPermissionsUser(documentId: $documentId) {
    profile_picture {
      url
    }
  }
}
`;

export const QEURY_BOOKINGID = gql`
query Booking($documentId: ID!) {
  booking(documentId: $documentId) {
    booking_id
  }
}
`;

export const QUERY_BOOKING = gql`
query Bookings($filters: BookingFiltersInput) {
  bookings(filters: $filters) {
    fname
    lname
    package {
      thumbnail {
        url
      }
      name
      type
    }
    quantity
    total_price
    payment {
      stripe_receipt_url
      status_payment
    }
    booking_status
    updatedAt
  }
}
`