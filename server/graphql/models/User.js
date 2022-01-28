class User {
  constructor(model) {
    this.Model = model;
  }

  signUp(signUpData) {
    if (signUpData.password !== signUpData.passwordConfirmation) {
      throw new Error("Password must be the same as password confirmation!");
    }

    return this.Model.create(signUpData);
  }

  signIn() {
    return "Signing In...";
  }

  signOut() {
    return "Signing Out...";
  }
}

module.exports = User;
