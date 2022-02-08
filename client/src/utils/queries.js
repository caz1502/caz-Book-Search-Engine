import { gql } from "@apollo/client";

export const QUERY_ME = gql`
  query me($email: String!) {
    me(email: $email) {
      username
      email
      savedBooks {
        title
        authors
        description
      }
      bookCount
    }
  }
`;
