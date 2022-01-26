exports.portfolioQueries = {
  portfolio: async (root, { id }, ctx) => {
    return await ctx.models.Portfolio.getByID(id);
  },
  portfolios: async (root, args, ctx) => {
    return await ctx.models.Portfolio.getAll();
  },
};

exports.portfolioMutations = {
  createPortfolio: async (root, { input }, ctx) => {
    const createdPortfolio = await ctx.models.Portfolio.create(input);
    return createdPortfolio;
  },
  updatePortfolio: async (root, { id, input }, ctx) => {
    const updatedPortfolio = await ctx.models.Portfolio.findAndUpdate(
      id,
      input
    );
    return updatedPortfolio;
  },
  deletePortfolio: async (root, { id }, ctx) => {
    const deletedPortfolio = await ctx.models.Portfolio.findAndDelete(id);
    return deletedPortfolio._id;
  },
};

exports.userMutations = {
  signIn: (root, args, ctx) => {
    return ctx.models.User.signIn();
  },
  signUp: (root, args, ctx) => {
    return ctx.models.User.signUp();
  },
  signOut: (root, args, ctx) => {
    return ctx.models.User.signOut();
  },
};
