// new file

import { gql } from "@apollo/client";

export const QUERY_ME = gql`
  query {
    me {
      username
      email
      savedBooks {
        authors
        description
        bookId
        image
        link
        title
      }
      bookCount
    }
  }
`;
