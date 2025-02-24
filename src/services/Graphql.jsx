import { gql } from "@apollo/client";

// Mutation สำหรับ Login
export const LOGINMUTATION = gql`
  mutation Mutation($input: UsersPermissionsLoginInput!) {
    login(input: $input) {
      jwt
    }
  }
`;

// Query สำหรับดึงข้อมูลผู้ใช้ (me)
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

// Mutation สำหรับสร้าง Booking
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

// Query สำหรับดึง Payment Intent
export const QUERY_PAYMENT_DATA = gql`
  query Booking($documentId: ID!) {
    booking(documentId: $documentId) {
      payment_intent_id
      client_secret
    }
  }
`;

// Query สำหรับดึงรายการแพ็คเกจ
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

// Query สำหรับดึงรายละเอียดแพ็คเกจ
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
  }
`;

// Query สำหรับดึง Payment Intent ID
export const QUERY_PAYMENT_INTENT_ID = gql`
  query Booking($documentId: ID!) {
    booking(documentId: $documentId) {
      payment_intent_id
    }
  }
`;

// Query สำหรับดึงรูปโปรไฟล์ผู้ใช้
export const QEURY_PROFILE = gql`
  query Me($documentId: ID!) {
    usersPermissionsUser(documentId: $documentId) {
      profile_picture {
        url
      }
    }
  }
`;

// Query สำหรับดึง Booking ID
export const QEURY_BOOKINGID = gql`
  query Booking($documentId: ID!) {
    booking(documentId: $documentId) {
      booking_id
    }
  }
`;

// Query สำหรับดึงข้อมูล Booking หลายรายการ (ใช้ filters)
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
      documentId
    }
  }
`;
