import "bootstrap/dist/css/bootstrap.min.css";
import "../styles/index.scss";

import Navbar from "../components/shared/Navbar";
import Hero from "../components/shared/Hero";

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

export default MyApp;
