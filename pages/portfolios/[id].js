import React from "react";
import { useRouter } from "next/router";

/* funtional component #1 */
// const PortfolioDetail = () => {
//   const router = useRouter();
//   // const id = router.query.id;
//   const { id } = router.query;

//   return <h1>I am Detail Page with ID: {id}</h1>;
// };

/* funtional component #2 */
const PortfolioDetail = ({ query }) => {
  const { id } = query;

  return <h1>I am Detail Page with ID: {id}</h1>;
};

PortfolioDetail.getInitialProps = ({ query }) => {
  return { query };
};

/* class component #1 */
// class PortfolioDetail extends React.Component {
//   // called on the server
//   static getInitialProps({ query }) {
//     // what you return here will get into this.props
//     return { query, test: "Hello world", num: 4 + 4 };
//     // return { query };
//   }

//   render() {
//     // const id = this.props.query.id;
//     const { id } = this.props.query;
//     return (
//       <h1>
//         I am Detail Page with ID: {id} {this.props.test} {this.props.num}
//       </h1>
//     );
//   }
// }

export default PortfolioDetail;
