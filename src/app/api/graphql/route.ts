import { startServerAndCreateNextHandler } from "@as-integrations/next";
import { ApolloServer } from "@apollo/server";
import { NextRequest } from "next/server";
import { typeDefs } from "./schema";
import { resolvers } from "./resolvers";
import mongoose, { Collection } from "mongoose";
import Users, { UserDocument } from "./datasources";
import UserModel from "./models";
import { Model } from "apollo-datasource-mongodb";

const uri = process.env.DATABASE_URL;

const connectDB = async () => {
  try {
    if (uri) {
      await mongoose.connect(uri);
      console.log("connected to database successfully");
    }
  } catch (error) {
    console.error("failed to connect to database");
  }
};
connectDB();

const server = new ApolloServer({
  resolvers,
  typeDefs,
}) as any;

const handler = startServerAndCreateNextHandler<NextRequest>(server, {
  context: async (req, res) => ({
    req,
    res,
    dataSources: {
      users: new Users({
        modelOrCollection: UserModel as unknown as Collection<UserDocument>,
      }),
    },
  }),
});
export async function GET(request: NextRequest) {
  return handler(request);
}
export async function POST(request: NextRequest) {
  return handler(request);
}
