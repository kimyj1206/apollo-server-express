const express = require('express');
const { makeExecutableSchema } = require('@graphql-tools/schema');
const { loadFilesSync } = require('@graphql-tools/load-files');
const path = require('path');
const PORT = 3003;
// apolloserver 3 version => 4 version migration
// const { ApolloServer } = require('apollo-server-express');
const { ApolloServer } = require('@apollo/server');
const cors = require('cors');
const { json } = require('body-parser');
const { expressMiddleware } = require('@apollo/server/express4');

const loadedFiles = loadFilesSync("**/*", {
  extensions: ['graphql']
});

const loadedResolvers = loadFilesSync(path.join(__dirname, '**/*.resolvers.js'));

async function startApolloServer() {
  const app = express();

  const schema = makeExecutableSchema({
    typeDefs: loadedFiles,
    resolvers: loadedResolvers
  })

  // graphql 요청을 핸들링하는 것을 포함하는 server 객체
  const server = new ApolloServer({
    schema
  })

  await server.start();

  // server.applyMiddleware({ app, path: '/graphql'});

  app.use('/graphql',
    cors(),
    json(),
    expressMiddleware(server, {
      context: async ({ req }) => ({ token: req.headers.token })
  }));

  app.listen(PORT, () => {
    console.log(`Running a GraphQL API server...`);
  })
};

startApolloServer();