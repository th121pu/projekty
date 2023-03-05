
import React, { useContext, useState, useEffect } from "react";
import { useIsAuthenticated } from "@azure/msal-react";
import { SignInButton } from "./SignInButton";
import userContext from "../contexts/userContext";
import { Navbar, Nav, NavItem, NavDropdown, MenuItem, Container } from 'react-bootstrap';
import { useNavigate } from "react-router-dom";
import { Formik, Field, Form } from "formik";
import { useMsal } from "@azure/msal-react";


/**
 * Renders the navbar component with a sign-in button if a user is not authenticated
 */
export const PageLayout = (props) => {
  const [chosenPage, setChosenPage] = useState("MENUS");
  const { user, setUser } = useContext(userContext);
  const isAuthenticated = useIsAuthenticated();
  const { instance } = useMsal();
  let navigate = useNavigate();
  function handleLogout(instance) {
    console.log('log out started');
    instance.logoutPopup().then(() => {
      console.log('teraz');
      setChosenPage("MENUS");
      navigate("../", { replace: true });
    }).catch(e => {
      console.error(e);
    });
  }


  useEffect(() => {
    if (window.location.pathname.includes("profile")) {
      setChosenPage("PROFILE");
    }
  }, [user]);



  function handleProfileStudent() {
    setChosenPage("PROFILE");
    let url = '../' + user.school.name.toLowerCase() + '/profile';
    navigate(url, { replace: true });

  }
  function handleMenusStudent() {
    setChosenPage("MENUS");
    let url = '/' + user.school.name.toLowerCase() + '/';
    navigate(url, { replace: true });
  }
  function handleCanteensStudent() {
    setChosenPage("CANTEENS");
    let url = '/' + user.school.name.toLowerCase() + '/canteens';
    navigate(url, { replace: true });
  }

  function handleOrdersAdmin() {
    setChosenPage("ORDERS");
    let url = '../' + user.school.name.toLowerCase() + '/admin/orders';
    navigate(url, { replace: true });

  }
  function handleMenusAdmin() {
    setChosenPage("MENUS");
    let url = '/' + user.school.name.toLowerCase() + '/admin';
    navigate(url, { replace: true });
  }
  function handleCanteensAdmin() {
    setChosenPage("CANTEENS");
    let url = '/' + user.school.name.toLowerCase() + '/admin/canteens';
    navigate(url, { replace: true });
  }


  return (
    <>{!isAuthenticated ? <>
      <Navbar style={{ cursor: "pointer" }} className='rectangle'>
        <a className="brand" onClick={() => navigate('..' + '/' + user.school.name.toLowerCase() + '/'
          , { replace: true })}>Uni-Canteen</a>
      </Navbar>
      <div className='sign-rectangle'>


        <Formik
          initialValues={{ email: "", password: "" }}
          onSubmit={async (values) => {
            await new Promise((resolve) => setTimeout(resolve, 500));
            //alert("Please sign in using POPUP!!");
          }}
        >
          <Form className='form-rectangle'>
            <h2 className='nadpis-rectangle'>Login</h2>
            <label htmlFor="email" className='email'>Email</label>
            <Field
              type="email"
              name="email"
              placeholder="Enter email"
              autoComplete="off"
              className="column"
            />

            <label htmlFor="password" className='email'>Password</label>

            <Field
              type="password"
              name="password"
              placeholder="Enter password"
              className="column"
            />

            <div className="buttons">
              <SignInButton />
              <button type="submit" className="button1">Submit</button>

            </div>
          </Form>
        </Formik>


      </div>
    </> :
      <>
        {user.role == 'ADMIN' ?
          <>
            <Navbar collapseOnSelect className="rectangle">
              <Navbar.Brand style={{ cursor: "pointer" }} className="header-uni" onClick={() => handleMenusAdmin()}>Uni-canteen</Navbar.Brand>
              <Navbar.Collapse id="responsive-navbar-nav">
                <Nav className="me-auto"></Nav>
                <Nav style={{ marginRight: "3.5%" }}>
                  <Nav.Link className={`${chosenPage === 'MENUS' ? "clicked" : ""}`}
                    onClick={() => handleMenusAdmin()}>MENUS</Nav.Link>
                  <Nav.Link className={`${chosenPage === 'CANTEENS' ? "clicked" : ""}`}
                    onClick={() => handleCanteensAdmin()}>CANTEENS</Nav.Link>
                  <Nav.Link className={`${chosenPage === 'ORDERS' ? "clicked" : ""}`}
                    onClick={() => handleOrdersAdmin()}>ORDERS</Nav.Link>
                  <Nav.Link className="lastNav" onClick={() => handleLogout(instance)}>LOGOUT</Nav.Link>
                </Nav>
              </Navbar.Collapse>
            </Navbar>
          </> : user.role == 'STUDENT' ?
            <>
              <Navbar collapseOnSelect className="rectangle">
                <Navbar.Brand style={{ cursor: "pointer" }} className="header-uni" o onClick={() => handleMenusStudent()}>Uni-canteen</Navbar.Brand>
                <Navbar.Collapse id="responsive-navbar-nav">
                  <Nav className="me-auto">
                  </Nav>
                  <Nav style={{ marginRight: "3.5%" }}>
                    <Nav.Link className={`${chosenPage === 'MENUS' ? "clicked" : ""}`}
                      onClick={() => handleMenusStudent()}>MENUS</Nav.Link>
                    <Nav.Link className={`${chosenPage === 'CANTEENS' ? "clicked" : ""}`}
                      onClick={() => handleCanteensStudent()}>CANTEENS</Nav.Link>
                    <Nav.Link className={`${chosenPage === 'PROFILE' ? "clicked" : ""}`}
                      onClick={() => handleProfileStudent()}>PROFILE</Nav.Link>
                    <Nav.Link className="lastNav" onClick={() => handleLogout(instance)}>
                      LOGOUT
                    </Nav.Link>
                  </Nav>
                </Navbar.Collapse>

              </Navbar>
            </> :
            <>
              <Navbar collapseOnSelect className="rectangle">
                <Navbar.Brand className="header-uni">Uni-canteen</Navbar.Brand>
              </Navbar></>
        }
        {props.children}</>}

    </>
  );
};