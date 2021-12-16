import { useState, useEffect } from "react";
import axios from "axios";
import { useLazyQuery, useMutation } from "@apollo/client";
import PortfolioCard from "@/components/portfolios/PortfolioCard";
import Link from "next/link";
import { GET_PORTFOLIOS, CREATE_PORTFOLIO } from "@/apollo/queries";

const graphUpdatePortfolio = (id) => {
  // mutation UpdatePortfolio {
  //   updatePortfolio(id: "${id}", input: {
  const query = `
    mutation UpdatePortfolio($id: ID) {
      updatePortfolio(id: $id, input: {
        title: "Updated Work",
        company: "Updated Company",
      }) {
        _id
        title
        company
        companyWebsite
        location
        jobTitle
        description
        startDate
        endDate
      }
    }`;

  const variables = { id };
  return axios
    .post(`http://localhost:3000/graphql`, { query, variables })
    .then(({ data: graph }) => graph.data)
    .then((data) => data.updatePortfolio);
};

const graphDeletePortfolio = (id) => {
  const query = `
    mutation DeletePortfolio($id: ID) {
      deletePortfolio(id: $id)
    }`;

  const variables = { id };
  return axios
    .post(`http://localhost:3000/graphql`, { query, variables })
    .then(({ data: graph }) => graph.data)
    .then((data) => data.deletePortfolio);
};

const fetchPortfolios = () => {
  const query = `
  query Portfolios {
      portfolios {
        _id,
        title,
        company,
        companyWebsite,
        location,
        jobTitle,
        description
        startDate
        endDate
      }
    }`;
  return axios
    .post(`http://localhost:3000/graphql`, { query })
    .then(({ data: graph }) => graph.data)
    .then((data) => data.portfolios);
};

const Portfolios = () => {
  const [portfolios, setPortfolios] = useState([]);
  const [getPortfolios, { loading, data }] = useLazyQuery(GET_PORTFOLIOS);
  const [createPortfolio] = useMutation(CREATE_PORTFOLIO, {
    update(cache, { data: { createPortfolio } }) {
      // debugger;
      const { portfolios } = cache.readQuery({ query: GET_PORTFOLIOS });
      cache.writeQuery({
        query: GET_PORTFOLIOS,
        data: { portfolios: [...portfolios, createPortfolio] },
      });
    },
  });

  // const onPortfolioCreated = (dataCreated) => {
  //   // debugger;
  //   setPortfolios([...portfolios, dataCreated.createPortfolio]); // useMutation createPortolio naming 그대로 들어온다
  // };

  // const [createPortfolio] = useMutation(CREATE_PORTFOLIO, {
  //   onCompleted: onPortfolioCreated,
  // });

  useEffect(() => {
    getPortfolios();
  }, []);

  if (
    data &&
    data.portfolios.length > 0 &&
    (portfolios.length === 0 || data.portfolios.length !== portfolios.length) // 매우 복잡..
  ) {
    setPortfolios(data.portfolios);
  }

  if (loading) {
    return "Loading...";
  }

  const updatePortfolio = async (id) => {
    const updatedPortfolio = await graphUpdatePortfolio(id);
    const index = portfolios.findIndex((p) => p._id === id);
    const updatedPortfolios = [...portfolios];
    updatedPortfolios[index] = updatedPortfolio;
    setPortfolios(updatedPortfolios);
  };

  const deletePortfolio = async (id) => {
    const deletedId = await graphDeletePortfolio(id);
    const index = portfolios.findIndex((p) => p._id === deletedId);
    const newPortfolios = portfolios.slice();
    newPortfolios.splice(index, 1);
    setPortfolios(newPortfolios);
  };

  return (
    <>
      <section className="section-title">
        <div className="px-2">
          <div className="pt-5 pb-4">
            <h1>Portfolios</h1>
          </div>
        </div>
        <button onClick={createPortfolio} className="btn btn-primary">
          Create portfolio
        </button>
      </section>
      <section className="pb-5">
        <div className="row">
          {portfolios.map((portfolio) => (
            <div key={portfolio._id} className="col-md-4">
              <Link href="/portfolios/[id]" as={`/portfolios/${portfolio._id}`}>
                <a className="card-link">
                  <PortfolioCard portfolio={portfolio} />
                </a>
              </Link>
              <button
                onClick={() => updatePortfolio(portfolio._id)}
                className="btn btn-warning"
              >
                Update portfolio
              </button>
              <button
                onClick={() => deletePortfolio(portfolio._id)}
                className="btn btn-danger"
              >
                Delete portfolio
              </button>
            </div>
          ))}
        </div>
      </section>
    </>
  );
};

export default Portfolios;
