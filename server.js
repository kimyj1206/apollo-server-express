const express = require('express');
const app = express();
const PORT = 3003;
// const { buildSchema } = require('graphql');
// apollo를 이용하기에 아래 패키지 필요없음
const { graphqlHTTP } = require('express-graphql');
const { makeExecutableSchema } = require('@graphql-tools/schema');
const { loadFilesSync } = require('@graphql-tools/load-files');
const path = require('path');

// schema 작성
// ! => 필수 입력 속성
// const schema = buildSchema(`
//   type Query {
//     posts: [Post],
//     comments: [Comment]
//   }

//   type Post {
//     id: ID!
//     title: String!
//     description: String!
//     comments: [Comment]
//   }

//   type Comment {
//     id: ID!
//     text: String!
//     likes: Int
//   }
// `);


// graphql-tools/schema 이용해서 schema 모듈로 분리
// const schemaString = (`
//   type Query {
//     posts: [Post],
//     comments: [Comment]
//   }

//   type Post {
//     id: ID!
//     title: String!
//     description: String!
//     comments: [Comment]
//   }

//   type Comment {
//     id: ID!
//     text: String!
//     likes: Int
//   }
// `);

// const schema = makeExecutableSchema({
//   typeDefs: [schemaString]
// });


// 모든 폴더의 모든 파일의 확장자가 graphql을 불러옴
const loadedFiles = loadFilesSync("**/*", {
  extensions: ['graphql']
});

// resolvers 모듈화
const loadedResolvers = loadFilesSync(path.join(__dirname, "**/*.resolvers.js"));

const schema = makeExecutableSchema({
  typeDefs: loadedFiles,

  // resolvers 필터링 역할

  // parent : 필드 부모에 대한 반환 값
  // args : graphql 인수를 포함하는 객체
  // context : 모든 resolver 간에 공유되는 object ex) 인증 정보
  // info : 작업 실행 상태에 대한 정보

  // resolvers: {
  //   Query: {
  //     posts: (parent, args, context, info) => {
  //       return parent.posts;
  //     },
  //     comments: (parent) => {
  //       return parent.comments;
  //     }
  //   }
  // }

  resolvers: loadedResolvers
});


// description value 설정
// model로 분리 -> 후에 model에서 직접 가져오기에 해당 코드 필요 없어짐
// const root = {
  // posts: [
  //   {
  //     id: 'post1',
  //     title: 'It is a first post',
  //     description: 'It is a first post description',
  //     comments: [{
  //       id: 'comment1',
  //       text: 'It is a first comment',
  //       likes: 1
  //     }]
  //   },

  //   {
  //     id: 'post2',
  //     title: 'It is a second post',
  //     description: 'It is a second post description',
  //     comments: []
  //   }
  // ],

  // comments: [
  //   {
  //     id: 'comment1',
  //     text: 'It is a first comment',
  //     likes: 1
  //   }
  // ]

//   분리한 모듈 가져오기
//   posts: require('./posts/posts.model'),
//   comments: require('./comments/comments.model')
// }


// 해당 경로로 접속 시 graphql 응답 전송
// express-graphql 삭제 => apollo 대체
app.use('/graphql', graphqlHTTP({
  schema: schema,
  // rootValue: root,
  graphiql: true
}));

app.listen(PORT, () => {
  console.log(`Running a GraphQL API server at http://localhost:${PORT}/graphql`);
});