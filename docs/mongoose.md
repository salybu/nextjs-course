## #4. Apollo for React

### [update, delete portfolios improvement](https://github.com/salybu/nextjs-course/commit/ca47443867438b98da8d5c4ca6082cfcccd58877)

- we can move existing query to our apollo folder, we need to `separate existing queries` and use `useMutation`.

- when we use useMutation method, we need to provide here ID as an object.

```javascript
onClick={() => updatePortfolio(portfolio._id)}
```

```javascript
onClick={() => updatePortfolio({ variables: { id: portfolio._id } })}
```

- before we change the code, we need to refresh the page after clicking the update button, but after separating query to apollo folder, you can find it updated right after clicking update button.

- no additional changes are required. you don't need to update a cache because cache is automatically updated for you.

&nbsp;

- in delete function, we need provider of that function because we don't delete it in a real time, we need to update cache like this.

```javascript
const [deletePortfolio] = useMutation(DELETE_PORTFOLIO, {
  update(cache, { data: { deletePortfolio } }) {
    const { portfolios } = cache.readQuery({ query: GET_PORTFOLIOS });
    const newPortfolios = portfolios.filter((p) => p._id !== deletePortfolio);
    cache.writeQuery({
      query: GET_PORTFOLIOS,
      data: { portfolios: newPortfolios },
    });
  },
});
```

- move this update(cache) function and also all of our Mutations to separate files. I would like to create dedicated functions to updating and deleting.

- we're just specifying functions in our portfolios. we'll do it differently, we'll create functions that will be returned from our `useMutation` at `apollo/action/index.js` and we'll use these functions in our `portfolio/index.js`.

- so we don't need to destructure the functions. It will be function but will call our `useMutation` function. We'll specify here as an arrow function so we'll call useMutation.

- and in this path, I don't need to go with `@ sign` here because we're in the same folder. but if you prefer, you can write like this from `@/apollo/queries`.

- you can see [the refactored code very nicely](https://github.com/salybu/nextjs-course/commit/81e37132d1be938807e8d4067606c8a43e3b869c). It's much more readable and easier to think about our code.

```javascript
/* apollo/actions/index.js */
export const useGetPortfolios = () => useQuery(GET_PORTFOLIOS);
export const useUpdatePortfolio = () => useMutation(UPDATE_PORTFOLIO);
....
```

```javascript
/* pages/portfolios/index.js */
import { useGetPortfolios, ... } from "@/apollo/actions";

const Portfolios = () => {
    const { data } = useGetPortfolios();
    const [updatePortfolio] = useUpdatePortfolio();
```

&nbsp;

### Mongo Atlas

- We will create Mongo Atlas DB. Mongo Atlas is nosql DB so data are stored as objects in JS. sign up, sign in, and create a new project.

- `server/config/dev.js` will keep my environment variables. I would like to export an object that will define my variables

  - `.gitignore` is the list all of the folders, files you don't want to push to a github repository or to Heroku when will be deploying our application.
  - connection string to the DB is very sensitive because with this, basically anybody can connect to our DB. It's important to protect or hide this information.

- I want to specify varirables that will hold connection string to my DB. Every DB has its unique connection string. With this connection string, you can connect to your DB, manipulate (create, update, delete..) DB.

- for this, you need to create a cluster and then you can get your connection string to your DB.

- for connecting to the DB, we'll use `Mongoose` which is very nice JS package to work with MongoDB. It will provide some environment, some API we can use. so we can manipulate our data.

- Collection is where our data is stored. We have `collections`, and in each collections we have the `documents`. You can imagine Collection for example, cars, portfolios, users... and in this collection, you have specific documents for example in the cars, you have car1, car2, car3... with each unique data.

- Click the Dashboard button connect. we can get connection string, and as you can see here, we are missing some data. We need to provide here username and pw of your administration user that has a read and write rights to your DB.

- and Dashboard > security > Database Access. we can create a administration user
- and Dashboard > security > Network Access. we can allow access from anywhere (0.0.0.0). we need to whitelist an IP Address.

- We have our connection string, user, and a whitelist of IP address.

&nbsp;

- install mongoose

- mongoose.connect() you need to provide your unique `connection string` we have in our `config`(`config.DB_URI`). 2nd parameter callback function will be executed when you will be connected to DB.

- to resolve this captured terminal warning, add 2nd options object to connect method.

```javascript
/* server/database/index.js */
const mongoose = require("mongoose");
const config = require("../config/dev");

exports.connect = () => {
  mongoose.connect(
    config.DB_URI,
    { useNewUrlParser: true, useUnifiedTopology: true }, // can be removed
    () => {
      console.log("connected to DB");
    }
  );
};
```

&nbsp;

- so now we can use it in our `server/index.js`. This will provide object of the function we exported from a DB code. It will now hold an object of all of the exports I defined.

```javascript
/* server/index.js */
require("./database").connect();
```

&nbsp;

- We try to `populate the DB` with some data. so we will _**start storing portfolios**_ and for this we need to _**create `models`**_ of our data.

  - in Dashboard, we can find our collection 0 (empty). We need to _**create collection**_, we need to _**populate them with documents**_.

&nbsp;

- First of all, you need to _**create some representation of your data**_ called `schema`.

- If you want to create some data, you need to `register models` in mongoose. for this we need to create `schema`.

  - we would like to _**create portfolio schema**_ which will describe our data with the properties like title, description ... (in resolver/index.js)
  - We need to describe our DB with these properties to _**how they will be saved into Mongo Atlas DB**_.

- From a `schema`, we need to create a portfolio `model`, and with this model we can `interact` with our DB.

- we want to create some documents, we need to create this model, and model exports couple of functions. actually lots of functions to find a document by ID... and so on.

- with this model, you can store this data to your Mongo Atlas DB.

```javascript
/* server/database/models/portfolio.js */
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const portfolioSchema = new Schema({
  title: { type: String, required: true, maxlength: 128 },
  company: { type: String, required: true, maxlength: 64 },
  ....
  startDate: { type: Date, required: true },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Portfolio", portfolioSchema); // model name, schema
```

&nbsp;

- you have also option to create from a model instance of this model with a new() keyword. ????????????? what's this ????????????????

- with a new() keyword, you can create an instance of that model and on the instance of the Model you have a different functions. some of them are the same and some of them are different, it depends on the circumstances which one you want to use.

- What is important for us now is to create a `schema`, and then `model`. That's we need to `populate DB` with some initial data.

  - I will create an instance of itself, there're new schema which we will import here which will be object that will define our properties of our portfolio.

- and I need to define I need to provide some more information to these properties which types they are.

- so now you can imagine if I would store portfolio without the title, It wouldn't be stored and It would throw an error. maxLength of the characters that's provided by title.

- so if the user provide the title longer than 64 characters, portfolio will be not saved because it will throw an error that title is longer as it should be.

&nbsp;

- What do you want to export from here is _**not an actual schema**_ but a `model`. and then choose a name, usually a name in the _**upper case of first letter**_, and _**2nd parameter**_ you can _**transfer a schema**_.

- and go to our DB and import here model.

```javascript
/* server/database/index.js */
require("./models/portfolio");
```

&nbsp;

- so we need to populate DB with some initial data. for this I will create separate folder where I will create functionality to populate DB with some initial data from some file it will define.

- in fakeDB file, I will specify functionalities functions like to clean DB or populate DB with some data.. for now, just create class and export it from here. I will export from here an instance of a class fakeDB

- fakeDB will have these functionalities like clean(), populate() and so on.

```javascript
/* server/fakeDB/fakeDB.js */
class FakeDB {
  populate() {}
  clean() {}
}

module.exports = new FakeDB();
```

- new file will be function that will connect to our DB and we'll execute the functions of fakeDB. It will be functionalities to populate our DB, and then we need data.

  - just copy `resolver/index.js`. there are initial datas in resolvers.

- mongoose will create this ID automatically for us when our data will be added to a DB.

- here, What we need to do is to connect to DB and to execute some functions while they're connected to DB. also import fakeDB because it will provide here functionalities to clean DB, populate DB and so on.

```javascript
/* server/fakeDB/populate.js */
const mongoose = require("mongoose");
const config = require("../config/dev");

mongoose.connect(config.DB_URI, () => {
  console.log("populating DB ..........");
  console.log("connected to DB");
});
```

- and simply here, we connect to DB and simply copy from index.js. populate.js just connecting to DB and we specified model. I want to connect straight away, so remove exports. node server/fakeDB/populate.js is working. and add this command to package.json as custom scripts.

```javascript
/* package.json */
"populateDB": "node server/fakeDB/populate.js"
```

&nbsp;

- We created portfolio `model`, start `creating fakeDB`. We'll finish implementation of fakeDB and we'll push some initial data to our DB.

  - maybe We can verify our data with our model in our portfolio.
  - usually we will reference here _**model with upper case**_.

- and then we need to take a look on our `fakeDB API`. accessing my model `Portfolio`. and on model, we have lots of functions we can use to `manipulate our DB`.

  - we have our functions `deleteMany()`. We need to call it and when you want to _**remove all of your documents of portfolios**_. you will provide here _**empty curly brackets**_.
  - later you will have _**multiple lines**_ so you would like to _**synchronize all of these**_.

```javascript
/* server/fakeDB/fakeDB.js */
const { portfolios } = require("./data");
const Portfolio = require("../database/models/portfolio");

class FakeDB {
  async clean() {
    await Portfolio.deleteMany({});
  }

  async addData() {
    await Portfolio.create(portfolios);
  }

  async populate() {
    await this.clean();
    await this.addData();
  }
}

module.exports = new FakeDB();
```

- This will `return promise` so I will write await and mark this function as async.

- This will create `documents`. First, it will create a `collection` of portfolios if you _**don't have any collection**_ of portfolios in your DB. and then It will `create documents` of portfolios from a data we have specified here.

- and now we need to _**provide this `functionalities` to our fakeDB**_.

&nbsp;

```javascript
/* server/fakeDB/populate.js */
.....
const fakeDB = require("./FakeDB");

mongoose.connect(config.DB_URI, async () => {
  console.log("starting populating DB ...");
  await fakeDB.populate();
  await mongoose.connection.close();
  console.log("DB has been populated ...");
});
```

- In this _**callback functions**_ after we are connected to DB, we can `execute these functions` we have just created.
- After it's populated, you would like to `close connection` to our DB because you don't need to be connected to DB when everything is done. When you want to close connection, you just `access mongoose`...

- and now after we'll execute `populate.js`. These should clean and populate our DB.

- After we refresh it, you should have your collection of portfolios. DB name is what we specified in DB URI.

- ID was automatically added by Mongoose. mongoose generate this ID when document is added to a collection and ... your date is transformed into this format of the dates and also we have here createdAt.

&nbsp;

### Get Portfolio from DB

- In this lecture, we `populate our DB` with initial data of portfolios and try to `fetch them` _**from our DB**_ and `display them` in an application.

- In `resolver` folder, we're using here data when we are `fetching`, `creating`. I will still keep them here just for now, we'll try to [change our portfolio and portfolios](https://github.com/salybu/nextjs-course/commit/253568db718897d645cb7b4a9bbec68581d22fd1).

```javascript
/* graphql/resolvers/index.js */
const Portfolio = require("../../database/models/portfolio");
.....
exports.portfolioQueries = {
  portfolio: async (root, { id }) => {
    return await Portfolio.findById(id);
  },
  portfolios: async () => {
    return await Portfolio.find({});
  },
};
```

- and in resolver, what I will import here is our `portfolio model`. find() with empty curly bracket, this will _**find you all of the portfolios / `documents`**_ from your portfolio `collection`.

- you can notice that your date looks differentyly because _**Mongoose transform them to `Date` in ms**_. so that's why we're displaying this big number here.

&nbsp;

### #51. Portfolio create, update, delete in DB

- In previous lecture, we _**fetch portfolio by ID**_ and all of the _**portfolios from DB**_. and similarly as we did in the last lecture, we need to `change our mutations`.

- To `create`, we need to `provide the object` _**with all of the properties**_ we have _**defined in our `model`**_.

  - We have all of this on our `inputs`. and this will `return promise` if you want to get here actual portfolio from this function.
  - in DB dashboard, you will see that you will have lots of new portfolios.

```javascript
/* graphql/resolvers/index.js */
exports.portfolioMutations = {
  createPortfolio: async (root, { input }) => {
    const createdPortfolio = await Portfolio.create(input);
    return createdPortfolio;
  },
  updatePortfolio: async (root, { id, input }) => {
    const updatedPortfolio = await Portfolio.findOneAndUpdate(
      { _id: id },
      input,
      { new: true }
    );
    return updatedPortfolio;
  },
  deletePortfolio: async (root, { id }) => {
    const deletedPortfolio = await Portfolio.findOneAndRemove({ _id: id });
    return deletedPortfolio._id;
  },
};
```

- If you want to _**find one**_, we need to provide here _**parameters of ID**_, as curly bracket. now we'll specify the properties.

- _**2nd value**_ is for the _**data you would like to update**_. These are getting from input. In _**3rd optional value**_, you will specify options of `{new: true}`. This option will ensure that you will _**get your document back**_.

  - when I provide {new}, I will _**get my old documents**_ here stored in an updated portfolio. because otherwise It wouldn't return to me this document from DB.

- we can continue with delete, and return ID. because we specify this in `server/index.js` typeDefs gql.

&nbsp;

### #52. [GraphQL portfolio model](https://github.com/salybu/nextjs-course/commit/8860fb359f6588beb03e049c71ac97692a36547e)

- We'll do _**structural changes on server**_. What I would like to change is actually add here 1 _**abstraction layer**_.

  - currently in a `graphql/resolvers` folder, we're _**communicating with DB straight**_ here. so import these operations from other files.

- Apollo documentation suggested to _**create an abstraction layer**_ called `models`. your models will be responsible for _**communicating to your DB**_.

  - so you'll _**create models**_ and can _**specify all the functions**_.
  - here in my `resolver`, I will only _**receive my model**_ and I will _**use these model functions**_.

- in `DB`, we have _**already models**_ but these are _**about `mongoose`**_. DB models are _**describing our data**_.

- Our GraphQL models will be different. Portfolio.js will be `Class`.

&nbsp;

- We need here our `model` of portfolio how we're _**communicating with DB**_. I would like to _**pass model from outside**_. so we can make this _**component `reusable`**_. I will specify here `constructor`.

  - just imagine we're creating this _**portfolio instance**_ somewhere in our code and we're _**passing our portfolio model**_. so in constructor, I will _**receive model**_.

- and simply I will _**assign this model**_ to my `context` of portfolio. now this model is referencing.

```javascript
/* graphql/models/Portfolio.js */
class Portfolio {
  constructor(model) {
    this.Model = model; // this.Model === Portfolio
  }

  async getAll() {
    return await this.Model.find({});
  }
  ......
}

module.exports = Portfolio;
```

- now we can imagine we're _**passing this from outside**_ as a model and we're _**assigning it to this context**_. What we need to do is to _**pass this portfolio model**_ to our _**resolver**_. We need to somehow `get this model` here and we'll `get it through the context`.

- for this, we need to go to our `server/index.js` because we're _**specifying our `Apollo server`**_. we can provide multiple options to Apollo server. We can _**specify additional context**_ like this as a function

```javascript
/* server/index.js */
.....
const mongoose = require("mongoose");
const Portfolio = require("./graphql/models/Portfolio"); // GraphQLModel

app.prepare().then(() => {
  const server = express();

  const apolloServer = new ApolloServer({
    typeDefs,
    resolvers,
    context: () => ({
      models: {
        Portfolio: new Portfolio(mongoose.model("Portfolio")),
      },
    }),
  });
```

- Whatever you will return here will be provided to all of your resolvers. now You're returning context object. I'd like to return object of models. then define my GraphQL models.

- now we're creating this instance of our model. What we're expecting to receive is specified here, an actual Mongoose model. so we need to pass this Mongoose model, for this we need to import mongoose.

- `mongoose.model("Portfolio")` thiss will get you your Portfolio model from a mongoose. our portfolio model is now initialized in the context and It's sent to all of our resolvers through the context.

- These are the better structure because now our models are responsible for communications in. our DB and resolvers are just accessing its model.

- We'll change our model and simply this way we don't need to change our resolvers but to change a model. I need to pass a new model in `server/index.js` for example DB or something.

```javascript
/* graphql/resolvers/index.js */
exports.portfolioQueries = {
  portfolio: async (root, { id }, ctx) => {
    return await ctx.models.Portfolio.getByID(id);
  },
  portfolios: async (root, args, ctx) => {
    return await ctx.models.Portfolio.getAll();
  },
};
```

&nbsp;

### #53. Separating Apollo functions on server

- In previous lecture, we created portfolio model to communicate with DB. We're getting portfolio model in resolvers to the context where we're using its functions, and we will do more structural changes to server folder.

- What I would like to change now is our GraphQL functionality in our `server/index.js`. I would like to separate all of the graphql functionality from here to a separate function.

- We have typeDefs, resolvers. We're creating Apollo server. What I would like to return from this function is Apollo server itself.

- This will define all of our resolvers. This will return our Apollo server and will apply it here to our express.

- We're creating here express server and then creating Apollo server and then we're applying it to our express server.

- Creating Apollo server with all that type definitions here I have some portfolioTypes from ./types and our main types for queries and mutations, resolvers.

```javascript
/* graphql/index.js */
exports.createApolloServer = () => {
  .....
    return apolloServer;
};
```

```javascript
/* server/index.js */
app.prepare().then(() => {
  const server = express();
  const apolloServer = require("./graphql").createApolloServer();
  apolloServer.applyMiddleware({ app: server });
  ....
```
