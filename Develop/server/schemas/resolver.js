// new file

const { AuthenticastionError } = require("apollo-server-express");
const { User, Thought } = require("../models");
const { signToken } = require("../utils/auth");

const resolvers = {
  Query: {
    me: async (parent, args, context) => {
      if (context.User) {
        const userData = await User.findOne({ _id: context.user._id }).select(
          "__v -password"
        );
        console.log(userData);
        return userData;
      }

      throw new AuthenticastionError("You are not logged in");
    }
    },
    
    Mutation: {
        addUser: async (parent, args) => {
            const user = await User.create(args);
            const token = signToken(user);

            return { token, user };
        },
        login: async (parent, { email, password }) => {
            const user = await User.findOne({ email });

            if (!user) {
                throw new AuthenticastionError('Wrong credentials');
            }

            const correctPW = await user.isCorrectPassword(password);

            if (!correctPW) {
                throw new AuthenticastionError('Wrong credentials');
            }

            const token = signToken(user);
            return { token, user };
        },

        saveBook: async (parent, args, context) => {
            if (context.user) {
                const updateUser = await User.findByIdAndUpdate(
                    { _id: context.user._id },
                    { $push: { savedBooks: args.bookData } },
                    { new: true }
                );
                return updateUser
            }

            throw new AuthenticastionError('Login is required');
        },
        removeBook: async (parent, args, context) => {
            if (context.user) {
                const updateUser = await User.findOneAndUpdate(
                    { _id: context.user_id },
                    { $pull: { savedBooks: { bookId: args.bookId } } },
                    { new: true, runValidators: true, useFindAndModify: false }
                );

                return updateUser
            }
            throw new AuthenticastionError('Login is required');
        }
}


};

module.exports = resolvers;
