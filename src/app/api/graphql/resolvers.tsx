import bcrypt from "bcrypt";
import { InfuraProvider } from "ethers";
import jwt from "jsonwebtoken";

export const resolvers = {
  Query: {
    users: async (
      _: any,
      __: any,
      context: { dataSources: { users: { getAllUsers: () => any } } }
    ) => {
      try {
        return await context.dataSources.users.getAllUsers();
      } catch (error) {
        throw new Error("Failed to fetch users");
      }
    },

    user: async (
      _: any,
      { email }: any,
      context: { dataSources: { users: { getUser: (email: any) => any } } }
    ) => {
      try {
        return await context.dataSources.users.getUser(email);
      } catch (error) {
        throw new Error("Failed to fetch user");
      }
    },
    userByToken: async (
      _: any,
      { token }: any,
      context: { dataSources: { users: { getUser: (email: any) => any } } }
    ) => {
      try {
        const secretKey = process.env.JWT_SECRET_KEY;
        let user = jwt.verify(token, secretKey!);
        user = await context.dataSources.users.getUser(user.email);
        return user;
      } catch (error) {
        throw new Error("Failed to fetch user");
      }
    },
  },

  Mutation: {
    createUser: async (_: any, { input }: any, context: any) => {
      try {
        const { email, username, password } = input;
        const location = "Lagos";
        const saltRounds = 10;
        // const hashed_password = bcrypt.hashSync(password, saltRounds);

        const salt = bcrypt.genSaltSync(saltRounds);
        const hashed_password = bcrypt.hashSync(password, salt);

        const newUser = await context.dataSources.users.createUser({
          input: {
            email,
            username,
            hashed_password,
            location,
          },
        });

        const secretKey = process.env.JWT_SECRET_KEY;
        const token = jwt.sign(
          { email, hashed_password, location },
          secretKey!
        );
        console.log(token);
        return token;
      } catch (error) {
        throw new Error("Failed to create user");
      }
    },

    logIn: async (_: any, { input }: any, context: any) => {
      try {
        const { email, password } = input;
        const saltRounds = 10;
        // const hashed_password = bcrypt.hashSync(password, saltRounds);

        const user = await context.dataSources.users.getUser(email);

        const checkPassword = bcrypt.compareSync(
          password,
          user.hashed_password
        );

        const secretKey = process.env.JWT_SECRET_KEY;
        const location = user.location;
        if (checkPassword) {
          const userHash = user.hashed_password;
          const token = jwt.sign({ email, userHash, location }, secretKey!);
          console.log(token);
          return { token, user };
        } else {
          return null;
        }
      } catch (error) {
        console.log(error);
        throw new Error("Failed to login");
      }
    },
    updateUser: async (_: any, { input }: any, context: any) => {
      try {
        return await context.dataSources.users.updateUser({ input });
      } catch (error) {
        throw new Error("Failed to update user");
      }
    },
    deleteUser: async (_: any, { id }: any, context: any) => {
      try {
        return await context.dataSources.users.deleteUser({ id });
      } catch (error) {
        throw new Error("Failed to delete user");
      }
    },
  },
};
