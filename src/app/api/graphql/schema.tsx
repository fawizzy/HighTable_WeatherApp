export const typeDefs = `#graphql
type User {
  id: ID!
  username: String!
  email: String!
  hashed_password: String!
  location: String!
}

type AuthPayload {
  token: String
  user: User
}

input NewUserInput {
  username: String!
  email: String!
  password: String!
}

input UpdateUserInput {
  email: String!
  location: String!
}

input logInInput {
  email: String!,
  password: String!
}

type Query {
  userByToken(token: String): User
  user(email: String): User
  users: [User]
}
type Mutation {

  createUser(input: NewUserInput!): String
  logIn(input: logInInput): AuthPayload
  updateUser(input: UpdateUserInput!): User
  deleteUser(id: ID!): String
}
`;
