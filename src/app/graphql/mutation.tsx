import { gql } from "@apollo/client";

export const ADD_USER = gql`
  mutation AddUser($email: String, $name: String, $hashed_password: String) {
    addUser(email: $email, name: $name, hashed_password: $hashed_password) {
      id
      email
      name
      hashed_password
    }
  }
`;

export const UPDATE_USER = gql`
  mutation UpdateUser($location: String) {
    updateUser(location: $location) {
      id
      email
      name
      location
    }
  }
`;
