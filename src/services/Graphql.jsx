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
    documentId
    booking_id
    timetable {
      documentId
    }
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
query Query($filters: PackageFiltersInput) {
  packages(filters: $filters) {
    thumbnail {
      url
    }
    type
    status_package
    name
    location {
      district
      province
      sector
    }
    price
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
    package_id
    with_accommodation
    thumbnail {
        url
      }
    name
    price
    image {
      url
    }
    max_people
    duration
    location {
      documentId
      province
      google_place_id
      district
      sector
    }
    time
    meeting_point
    rating
    description
    detail {
      documentId
      accommodation
      price_includes
      tourist_attraction
    }
    timetables {
      documentId
      start
      end
    }
    status_package
    type
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

export const QEURY_BOOKINGID = gql`
query Booking($documentId: ID!) {
  booking(documentId: $documentId) {
    booking_id
  }
}
`

export const QUERY_BOOKING = gql`
query Bookings($filters: BookingFiltersInput) {
  bookings(filters: $filters) {
    province 
    district
    city
    address
    documentId
    tel
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
    timetable{
      start
      end
    }
  }
}
`
export const MUTATION_APPROVE = gql`
mutation Mutation($documentId: ID!, $data: BookingInput!) {
  updateBooking(documentId: $documentId, data: $data) {
    booking_status
  }
}`

export const UPDATE_PACKAGE = gql`
mutation UpdatePackage($documentId: ID!, $data: PackageInput!) {
  updatePackage(documentId: $documentId, data: $data) {
    name
    meeting_point
    max_people
    location {
      sector
      province
      district
    }
    price
    time
    timetables {
      start
      end
    }
    type
    duration
    detail {
      tourist_attraction
      price_includes
      accommodation
    }
    description
  }
}
`

export const DELETE_PACKAGE = gql`
mutation DeletePackage($documentId: ID!) {
  deletePackage(documentId: $documentId) {
    documentId
  }
}`