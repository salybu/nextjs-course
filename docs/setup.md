## #2. Base Project Setup

### Basic set up

- Apollo platform will handle `data requesting` (graphQL Queries), `State management`, Reactive update of UI, `Caching` and more

- Install `nodejs` LTS version, and `npm` (package manager) will allow us to _**install js packages**_ into our projects. follow the steps below

```
$ mkdir Projects
$ npm init -y
$ mkdir pages
```

&nbsp;

- The style file must be imported into `_app.js`. Otherwise, the error below will be displayed on the screen.

  > Global CSS cannot be imported from files other than your Custom < App>.

  > Due to the Global nature of stylesheets, and to avoid conflicts, Please move all first-party global CSS imports to pages/\_app.js. Or convert the import to Component-Level CSS (CSS Modules).

&nbsp;

- Write down the contents below in `_app.js`. `_app.js` wrap our pages for all of our pages folder.

```javascript
import "bootstrap/dist/css/bootstrap.min.css";
import "../styles/index.scss";

const MyApp = ({ Component, pageProps }) => {
  return <Component {...pageProps} />;
};

export default MyApp;
```

&nbsp;

- when you use `functional component` and export it, you `don't` need to `import React` because it handled automatically by nextjs. When you use Class component, you need to import React.

&nbsp;

- you can create _**pages folder**_ and in a folder you can _**create subpages**_. `portfolios.js` is possible, but subfolder `portfolio/index.js` is also possible.

  - maybe you're wondering what is the advanatage of writing your pages as these (write folders under pages folder).
  - now inside the portfolios folder you can create `multiple subpages`. so you can create `nesting of your pages` with this syntax.

&nbsp;

### Dynamic paths and various ways to extract ID from URL

- I would like to show you how to create dynamic pages like `/categories/xxxxxx` and how I can extract these from a URL. In `square brackets` `[]`, you will create _**dynamic part of the URL**_.

- What I can do now is I can _**extract this ID from a URL**_ . I will navigate to detail page I can retrieve this ID from URL. There are multiple ways how you can do it.

&nbsp;

1. the easiest way is use `useRouter()` function. useRouter (Hooks) can only be called inside of the body of a _**functional component**_.

```javascript
import { useRouter } from "next/router";

const PortfolioDetail = () => {
  const router = useRouter();
  const { id } = router.query;

  return <h1>I am Detail Page with ID: {id}</h1>;
};
```

&nbsp;

2. how we can extract these parameters from your URL in the `class component`. we can use here function `getInitialProps`.

```javascript
import React from "react";

class PortfolioDetail extends React.Component {
  // called on the server
  static getInitialProps({ query }) {
    // what you return here will get into this.props
    return { query, test: "Hello world", num: 4 + 4 }; // return { query };
  }

  render() {
    const { id } = this.props.query;
    return (
      <h1>
        I am Detail Page with ID: {id} {this.props.test} {this.props.num}
      </h1>
    );
  }
}
```

&nbsp;

- _**getInitialProps()**_ is very specific function for `nextjs environment`. _**getInitialProps()**_ is `called on a server` and there is difference in a nextjs framework between call _**called on a server**_ and between call _**called on a client**_ .

- we need to mark this function as a `static function`. you can use curly brackets, and it will extract a URL parameter and provide it to a class component. Whatever you're returning from getInitialProps(), we'll get extracted into `this.props` here.

&nbsp;

3. you can also use getInitialProps on your _**functional component**_ . We exactly do the same thing as you did with static `getInitialProps`, by using `PortfolioDetail.getInitialProps`

```javascript
const PortfolioDetail = ({ query }) => {
  const { id } = query;

  return <h1>I am Detail Page with ID: {id}</h1>;
};

PortfolioDetail.getInitialProps = ({ query }) => {
  return { query };
};
```

&nbsp;

### 9. Alias for absolute path

- `next.config.js` is in _**nodejs environment**_. so It would be executed by nodejs server.

  - `@` sign will mean that these are in my root folder.
  - Pacakge `path` doesn't need to be installed because it is _**natively available in nodejs**_ environment.

&nbsp;

```javascript
/* next.config.js */
const path = require("path");

module.exports = {
  webpack: (config) => {
    config.resolve.alias["@"] = path.resolve(__dirname);
    return config;
  },
};
```

- you need to write a `module.exports`, and you need to export `empty object` variable _**specify configuration**_ . What you would like to configure is a `webpack` package which is responsible for a _**bundling of our files**_.

- Whenever webpack will find a `file import`, we can tell that webpack if you will find here _**@ sign**_, this should _**reference a root folder**_.
  - `__dirname` will get you of current directory.

&nbsp;

```javascript
// import Navbar from "../../components/shared/Navbar";
import Navbar from "@/components/shared/Navbar";
```

- Whenever our project or files will be importing _**@ sign**_, this will be looking up to a `root folder` of our project. _**@ sign**_ will be fill path to our project component path... so don't need nest our path anymore.

&nbsp;

### 10. Root \_app component

- Whenever you will define `_app.js` component, this is your `entry point` to _**all of your pages**_ you're navigating to. `_app.js` component is responsible for rendering of all your pages.

- Whenever you go any pages defined in a pages folder, first thing it will happen is `_app.js` component will `be executed` and `render your page`. In `_app.js` what you're referencing this component, it's actually page you're navigating to.

&nbsp;

```javascript
/* _app.js */
const MyApp = ({ Component, pageProps }) => {
  // console.log(Component);

  return (
    <div className="portfolio-app">
      <Navbar />
      {Component.name === "Home" && <Hero />}
      <div className="container">
        <Component {...pageProps} />
      </div>
    </div>
  );
};
```

- When you write `console.log(component)` in `_app.js`, maybe you're wondering that it will be displayed on **the browser**, but being in **the terminal**.

- In the _**terminal**_ you will get the _**output from your server**_ because as I told you nextjs is a server-side render framework. Some of your code is executed on a `browser`, and some of your code is executed on the `server`.

&nbsp;

- `_app.js` component is responsible for _**rendering our pages**_, and a component holds our page, an actual page. In `_app.js` you can provide a _**navbar**_, _**footer**_, _**additional jsx**_ that you would like to _**render**_ or _**apply for all of my pages**_.

- You can _**conditionally check**_ for your component name, you can simply write here `Component.name` and this should _**reference the name**_ on your page. It's not about _**the router**_ or _**url page name**_ , but about the `exact component` that is rendered.

&nbsp;

### 11. get Initial props of \_app.js ...

- It will retrieve these data to the props in our component. Let's write props in Portfolio input, and we can get the testing data.

```javascript
/* _app.js */
import App from "next/app";
import Navbar from "../components/shared/Navbar";
import Hero from "../components/shared/Hero";

const MyApp = ({ Component, pageProps }) => {
  debugger;
  return (
    <div className="portfolio-app">
      <Navbar />
      {pageProps.appData}
      {Component.name === "Home" && <Hero />}
      <div className="container">
        <Component {...pageProps} />
      </div>
    </div>
  );
};

MyApp.getInitialProps = async (context) => {
  debugger;
  console.log("GET INITIAL PROPS _APP");
  const initialProps =
    App.getInitialProps && (await App.getInitialProps(context));
  console.log(initialProps);
  return {
    pageProps: { appData: "Hello _App Component", ...initialProps.pageProps },
  };
};

export default MyApp;
```

&nbsp;

- Write the contents above in `_app.js` and then access to `localhost:3000`, you can see a log below in terminal (server). The `console.log(initialProps);` is executed before returning an object containing appData prop, so nothing is printed to pageProps.

```
wait  - compiling / (client and server)...
event - compiled client and server successfully in 326 ms (185 modules)
GET INITIAL PROPS _APP
{ pageProps: {} }
```

&nbsp;

- But on the browser, the contents "Hello \_App ..." was printed on the screen. That means pageProps are sent to MyApp component.

- The `debugger;` in MyApp component is executed on the browser, so you can check the results in Source tab in browser Developer tools. If the developer tool on the browser doesn't open, the results cannot be viewed and `debugger;` code is also not paused.

<p align="center"><img src="https://user-images.githubusercontent.com/66893123/148897695-54f372ad-e879-4469-883f-aa0973454bda.PNG"  alt="nextjs-debugger"></p>
