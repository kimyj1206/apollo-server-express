const postsModel = require('./posts.model');

module.exports = {
  Query: {
    // rootValue의 root 값이 있어야지 parent에 값이 들어오는데 이미 리턴값을 함수가 들고있음
    // posts: (parent, args, context, info) => {
    //   return parent.posts;
    // }
    posts: () => {
      return postsModel.getAllPosts();
    },
    post: (_, args) => {
      return postsModel.getPostById(args.id);
    }
  },
  Mutation: {
    addNewPost: (_, args) => {
      return postsModel.addNewPost(args.id, args.title, args.description);
    }
  }
}