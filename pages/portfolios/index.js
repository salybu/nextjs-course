// import axios from "axios";
import { useQuery, useMutation } from "@apollo/client";
import PortfolioCard from "@/components/portfolios/PortfolioCard";
import Link from "next/link";
import {
  GET_PORTFOLIOS,
  CREATE_PORTFOLIO,
  UPDATE_PORTFOLIO,
  DELETE_PORTFOLIO,
} from "@/apollo/queries";
import withApollo from "@/hoc/withApollo";
import { getDataFromTree } from "@apollo/client/react/ssr";

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
  const { data } = useQuery(GET_PORTFOLIOS);
  const [updatePortfolio] = useMutation(UPDATE_PORTFOLIO);
  // debugger;
  const [deletePortfolio] = useMutation(DELETE_PORTFOLIO, {
    update(cache, { data: { deletePortfolio } }) {
      debugger;
      const { portfolios } = cache.readQuery({ query: GET_PORTFOLIOS });
      const newPortfolios = portfolios.filter(
        // (p) => p._id !== deletePortfolio._id
        (p) => p._id !== deletePortfolio
      );
      cache.writeQuery({
        query: GET_PORTFOLIOS,
        data: { portfolios: newPortfolios },
      });
    },
  });

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

  // const updatePortfolio = async (id) => {
  //   await graphUpdatePortfolio(id);
  // };

  // const deletePortfolio = async (id) => {
  //   await graphDeletePortfolio(id);
  // };

  const portfolios = (data && data.portfolios) || [];

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
                // onClick={() => updatePortfolio(portfolio._id)}
                onClick={() =>
                  updatePortfolio({ variables: { id: portfolio._id } })
                }
                className="btn btn-warning"
              >
                Update portfolio
              </button>
              <button
                // onClick={() => deletePortfolio(portfolio._id)}
                onClick={() =>
                  deletePortfolio({ variables: { id: portfolio._id } })
                }
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

export default withApollo(Portfolios, { getDataFromTree });
