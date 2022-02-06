## S3. GraphQL Beginnings

- I'll get you familiar with GraphQL queries and you'll be _**sending this queries to the server**_, the server will _**perform some operations**_ like create/update ... and you'll getback _**some response to client**_.

&nbsp;

### 17. GraphQL explanation

- Here is our `client-server` model. What I mean by _**working with the data**_ is to `send a request` from our applications _**in our browsers to the server**_ and to `fetch some data` _**from a server**_.

  - see _**this browser**_ as `client` running our application. Our app is making `requests` all the time to a server. request is going from a browser to a server.
  - Our `server` _**is handling this request**_ and then _**responding accordingly**_.

&nbsp;

- in `server/index.js` server _**receive a request**_, will _**handle it**_ to the functions provided by nextjs framework and will _**respond accordingly**_.

- in this case, We are sending a _**response to the page HTML document**_. in the browser, HTML file is rendered to our page. These are the standard model that are _**loading HTML document into our browser**_.

&nbsp;

#### but what if you would like to `fetch some data`?

- We need to send the _**asynchronous request from a browser**_, and we need to _**ask for a server**_ for some data which usually the _**server is connected to a DB**_.

&nbsp;

- In `REST API`, you are _**sending a request**_ but these request have to _**have some forms**_.

  - You need to provide as `URI`, _**identifies of your request**_, special path.
  - Server needs to _**understand this request**_ and they need to have some architecture and _**some implementation**_ implemented in our case on the `express` server \_**understand these REST API request**\_s.

- In a _**request URL**_, you're receiving _**data responded with JSON**_ with all data provided by server. These are handled by your client application.

- in Login, you send _**request URL, method, request payload**_, there are response which is JSON Web Token here.

&nbsp;

#### How does request looks like in a GraphQL

- GraphQL is _**a query language**_. You need to provide this query language _**from your clients**_.

  - You need to send request and the communication between the client and server. If there is a mutual agreement, you can receive data from a server.
  - GraphQL is _**a query language for API**_.

&nbsp;

- `Apollo` is nothing more than the specific JS implementation of a graphQL providing this data get layer (???????).

  - We need to _**implement an express framework**_, on express server. so, It will be _**aware of the graphQL**_ and this query language.

- Apollo is built on the _**top of the graphQL**_, implementing the standard of the graphQL. The standard will define graphQL.

- These we want to _**implement on the server**_, so our server will _**be aware of a data, a query**_ we'll be _**receiving from our client**_.

  - so We need to implement `Apollo` and `express`.

&nbsp;

#### How does it look like request in GraphQL?

- In graphQL, there's _**no GET / DELETE request**_. Everything is a `POST request` and depending what you are _**sending in the request payload**_, you are identifying _**your queries, mutations**_ or whatever you want to _**perform an operation**_.

  - usually What you're sending a request to is this address. Every request will _**go to this url**_, `/graphql`.
  - In every request, you're _**sending request payload**_ because it's the power of graphQL. You can define a data what you want to get ....

- and this _**graphQL request need to process it**_, it will _**find a resolver for this request**_.

&nbsp;

### [integrate GraphQL server](https://github.com/salybu/nextjs-course/commit/39a66d8939f08c88c14983c68508af24712b4b8f)

- `server/index.js` because here we are handling all of our request. We need to inform our express server about a graphQL. We need to install a couple of packages like below.

```
$ npm install express-graphql graphql
```

- After application is basically prepared and ready to create express server, we can create schema.

- every Incoming request will go to a `/graphql` which should be handled by graphQL implementation, and we need to provide resolver.

- but this schema is only definition of my query this is just schema of my query but I need to resolve this schema. but I need to resolve this schema and I need to handle to a client

```javascript
/* server/index.js */
const graphqlHTTP = require("express-graphql");
const { buildSchema } = require("graphql");

const data = {
  portfolios: [
    {
      _id: "sad87da79",
      title: "Job in Netcentric",
      ....
    },
    ....
  ],
};

app.prepare().then(() => {
  const server = express();

  // Construct a schema, using GraphQL schema language
  const schema = buildSchema(`
    type Portfolio {
      _id: ID!
      title: String
      ....
    }
    type Query {
      hello: String
      portfolio: Portfolio
      portfolios: [Portfolio]
    }
  `);

  // The root provides a resolver for each API endpoint
  const root = {
    hello: () => { return "Hello World!"; },
    portfolio: () => {
      return data.portfolios[0];
    },
    portfolios: () => {
      return data.portfolios;
    },
  };

  server.use( "/graphql", graphqlHTTP({
      schema,
      rootValue: root,
      graphiql: true,
    })
  );

  server.all("*", (req, res) => {
    return handle(req, res);
  });

```

&nbsp;

### Portfolio resolvers

-
