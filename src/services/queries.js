// src/graphql/queries.js

import { gql } from "@apollo/client";

// Query เพื่อดึงข้อมูลแพ็คเกจทั้งหมด
export const GET_PACKAGES = gql`
  query GetPackages {
    packages {
      id
      packageName
      category
      price
      description
      imageUrl
      dateRange
      isDraft
      key
    }
  }
`;

// Mutation เพื่อเพิ่มแพ็คเกจใหม่
export const ADD_PACKAGE = gql`
  mutation AddPackage($packageInput: PackageInput!) {
    addPackage(packageInput: $packageInput) {
      id
      packageName
      category
      price
      description
      imageUrl
      dateRange
      isDraft
    }
  }
`;

// Mutation เพื่ออัปเดตข้อมูลแพ็คเกจ
export const UPDATE_PACKAGE = gql`
  mutation UpdatePackage($packageInput: PackageInput!) {
    updatePackage(packageInput: $packageInput) {
      id
      packageName
      category
      price
      description
      imageUrl
      dateRange
      isDraft
    }
  }
`;

// Mutation เพื่อลบแพ็คเกจ
export const DELETE_PACKAGE = gql`
  mutation DeletePackage($id: ID!) {
    deletePackage(id: $id) {
      id
    }
  }
`;

// Mutation เพื่อลงประกาศแพ็คเกจ
export const PUBLISH_PACKAGE = gql`
  mutation PublishPackage($id: ID!) {
    publishPackage(id: $id) {
      id
      packageName
      isDraft
    }
  }
`;
