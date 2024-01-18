import { startServerAndCreateNextHandler } from "@as-integrations/next";
import { ApolloServer } from "@apollo/server";
import { NextRequest } from "next/server";
import { typeDefs } from "./schema";
import { resolvers } from "./resolvers";
import mongoose from "mongoose";
import Users from "./datasources";
import UserModel from "./models";

const uri = process.env.DATABASE_URL;

const connectDB = async () => {
  try {
    if (uri) {
      await mongoose.connect(uri);
      console.log("connected to database successfully");
    }
  } catch (error) {
    console.log(uri);
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
    dataSources: { users: new Users({ modelOrCollection: UserModel }) },
  }),
});
export async function GET(request: NextRequest) {
  return handler(request);
}
export async function POST(request: NextRequest) {
  return handler(request);
}
