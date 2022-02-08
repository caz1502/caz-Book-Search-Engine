// updated
const express = require("express");
const path = require("path");
const { ApolloServer } = require("apollo-server-express");
const db = require("./config/connection");
const { typeDefs, resolvers } = require("./schemas");

// apollo server
const app = express();
const PORT = process.env.PORT || 3001;
const server = new ApolloServer({
  typeDefs,
  resolvers,
});

server.applyMiddleware({ app });

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// when in production, serve client/build as static assets
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../client/build")));
}

// app.use(routes);
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../client/build/index.html"));
});

db.once("open", () => {
  app.listen(PORT, () => {
    console.log(`Legend API server running on port ${PORT}!`);
    console.log(
      `Legend Use GraphQL at http://localhost:${PORT}${server.graphqlPath}`
    );
  });
});