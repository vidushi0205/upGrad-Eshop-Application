import React, { useEffect } from "react";
import "./App.css";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import Auth from "./components/AuthenticationFile";
import { connect } from "react-redux";
import {
  setAddresses,
  setCategories,
  setProducts,
  setUser,
} from "./redux/actions";
import Home from "./components/home/Home";
import GetUsers from "./Utilities/getUser";
import DecodeToken from "./Utilities/decode_token";
import NewProduct from "./components/ProductExtraWork";
import getCategories from "./Utilities/getCategories";
import getProducts from "./Utilities/getProducts";
import Logout from "./components/Logout";
import ModifyProduct from "./components/ProductChange";
import Product from "./components/ProductsCreate";
import PlaceOrder from "./components/OrderPlacement";
import getAddress from "./Utilities/getAddresses";
import axios from "axios";

function App({ setUser, setCategories, setProducts, setAddresses }) {
  useEffect(() => {
    async function fetchUsers() {
      const usersList = await GetUsers();
      console.log(usersList);
      const decodedToken = DecodeToken();
      console.log(decodedToken);

      const users = usersList.filter((user) => user.email === decodedToken.sub);

      console.log(users[0]);
      setUser(users[0]);
    }

    async function fetchCategories() {
      const categories = await getCategories();
      console.log(categories);
      setCategories(categories);
    }
    async function fetchProducts() {
      const productsList = await getProducts();
      console.log(productsList);
      setProducts(productsList);
    }

    async function fetAddress() {
      const ad = await getAddress();
      console.log(ad);
      let formattedAddresses = ad.map((a) => {
        return {
          value: a,
          label: `${a.landmark}->${a.name},${a.city}`,
        };
      });

      console.log(formattedAddresses);
      setAddresses(formattedAddresses);
    }
    fetchUsers();
    fetchCategories();
    fetchProducts();
    fetAddress();
  }, []);

  return (
    <Router>
      <div>
        <Switch>
          <Route exact path="/">
            <Home />
          </Route>
          <Route exact path="/product/new">
            <NewProduct />
          </Route>
          <Route exact path="/logout">
            <Logout />
          </Route>

          <Route exact path="/place/order">
            <PlaceOrder />
          </Route>

          <Route
            exact
            path="/product/:product_id"
            render={(props) => {
              const product_id = props.match.params.product_id;
              return <Product product_id={product_id && product_id} />;
            }}
          />

          <Route
            exact
            path="/product/update/:product_id"
            render={(props) => {
              const product_id = props.match.params.product_id;
              return <ModifyProduct product_id={product_id && product_id} />;
            }}
          />
          <Route
            exact
            path="/auth/:type"
            render={(props) => {
              const type = props.match.params.type;
              return <Auth type={type && type} />;
            }}
          />
        </Switch>
      </div>
    </Router>
  );
}

const mapDispatchToProps = (dispatch) => ({
  setUser: (user) => dispatch(setUser(user)),
  setCategories: (categories) => dispatch(setCategories(categories)),
  setProducts: (products) => dispatch(setProducts(products)),
  setAddresses: (address) => dispatch(setAddresses(address)),
});
export default connect(null, mapDispatchToProps)(App);
