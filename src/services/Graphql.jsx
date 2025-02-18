import {gql} from '@apollo/client'
export const LOGINMUTATION = gql`
mutation Mutation($input: UsersPermissionsLoginInput!) {
  login(input: $input) {
    jwt
  }
}
`
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
`
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
  }
}
`
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
`

export const QUERY_PACKAGELIST = gql`
query Query {
  packages {
    name
    location {
      district
      province
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
`

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
    }
    time
    note
    price_includes
    meeting_point
    rating
    package_details {
      name
      detail
    }
    description
  }
}`

export const QUERY_PAYMENT_INTENT_ID = gql`
query Booking($documentId: ID!) {
  booking(documentId: $documentId) {
    payment_intent_id
  }
}
`

export const QEURY_PROFILE = gql`
query Me($documentId: ID!) {
  usersPermissionsUser(documentId: $documentId) {
    profile_picture {
      url
    }
  }
}
`

