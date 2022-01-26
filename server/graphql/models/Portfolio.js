class Portfolio {
  constructor(model) {
    // this.Model === Portfolio
    this.Model = model;
  }

  async getAll() {
    return await this.Model.find({});
  }

  async getByID(id) {
    return await this.Model.findById(id);
  }

  async create(data) {
    return await this.Model.create(data);
  }

  async findAndUpdate(id, data) {
    return await this.Model.findOneAndUpdate({ _id: id }, data, { new: true });
  }

  async findAndDelete(id) {
    return await this.Model.findOneAndRemove({ _id: id });
  }
}

module.exports = Portfolio;
