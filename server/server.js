// updated

const express = require("express");
const path = require("path");

// Import the ApolloServer class
const { ApolloServer } = require("apollo-server-express");
const db = require("./config/connection");
const { typeDefs, resolvers } = require("./schemas");
const { authMiddleware } = require("./utils/auth");

// Create a new instance of an Apollo server with the GraphQL schema
const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: authMiddleware,
});

// Update Express.js to use Apollo server features
const PORT = process.env.PORT || 3001;
const app = express();
server.applyMiddleware({ app });

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// if we're in production, serve client/build as static assets
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../client/build")));

  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "../client/build/index.html"));
  });
}

db.once("open", () => {
  app.listen(PORT, () => {
    console.log(`Boofhead - API server running on port ${PORT}!`);
    console.log(`Boofhead - Use GraphQL at http://localhost:${PORT}${server.graphqlPath}`);
  });
});
