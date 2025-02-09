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
mutation Mutation($data: BookingInput!) {
  createBooking(data: $data) {
    customers {
      documentId
    }
    total_price
    package {
      documentId
    }
    quantity
    documentId
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

export const MUTATION_PAYMENT_INTENTID = gql`
query Booking($documentId: ID!) {
  booking(documentId: $documentId) {
    payment_intent_id
  }
}
`
// {
//   "documentId": "l1vee2vftw3a9yamgjiggalb"
// }