import React, { useContext, useState, useEffect } from "react";
import { useMsal } from "@azure/msal-react";
import { loginRequest } from "../authConfig";
import Button from "react-bootstrap/Button";
import { ProfileData } from "../components/ProfileData";
import { callMsGraph, callMsGraph_role } from "../graph";
import userContext from "../contexts/userContext";
import { useNavigate } from "react-router-dom";
import { SignOutButton } from "../components/SignOutButton";
import StudentPage from "./StudentPage";

export default function MainPage() {
  const { instance, accounts } = useMsal();
  const [graphData, setGraphData] = useState(null);
  const [roleData, setRoleData] = useState(null);
  const [tenantId, setTenantId] = useState(null);
  const [userObjectBE, setUserObjectBE] = useState(null);
  let navigate = useNavigate();

  let url = "https://uni-canteen-backend.azurewebsites.net"; //"http://localhost:8080";

  const { user, setUser } = useContext(userContext);

  const name = accounts[0] && accounts[0].name;

  // get token from our BE
  function getUserTokenFromBE(role, usedGraphData, usedTenantId) {
    let singleRole;

    if (role === undefined || role.length === 0)
      singleRole = "00000000-0000-0000-0000-000000000000";
    else if (role.length > 1) singleRole = role[1].appRoleId;
    else singleRole = role[0].appRoleId;

    const body = {
      displayName: usedGraphData.displayName,
      mail: usedGraphData.mail,
      userPrincipalName: usedGraphData.userPrincipalName,
      id: usedGraphData.id,
      tenantId: usedTenantId,
      roleId: singleRole,
    };

    console.log(body);

    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json", tenantId: usedTenantId },
      body: JSON.stringify(body),
    };

    fetch(url + "/user/verifyUser", requestOptions)
      .then((response) => response.text())
      .then((data) => {
        console.log(data);
        let token = data;

        localStorage.setItem("token", token);
        getCurrentUser(token);
      })
      .catch((err) => {
        console.log(err);
      });
  }

  // get current user with acquired token from our BE
  function getCurrentUser(token) {
    const requestOptions = {
      headers: { token: token },
    };

    fetch(url + "/user/getCurrentUser", requestOptions)
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        let userObject = data;
        setUser(userObject);
        setUserObjectBE(userObject);

        //routing based on response
        console.log("routing started from main page");
        let url = "/" + userObject.school.name.toLowerCase();
        if (userObject.role == "ADMIN") url = url + "/admin";
        console.log(url);
        navigate(".." + url, { replace: true });
      })
      .catch((err) => {
        console.log(err);
      });
  }

  // contact Azure Graph API to get ActiveDirectory user info
  function RequestProfileData() {
    const request = {
      ...loginRequest,
      account: accounts[0],
    };

    // Silently acquires an access token which is then attached to a request for Microsoft Graph data
    instance
      .acquireTokenSilent(request)
      .then((response) => {
        let usedTenantId = response.tenantId;
        let accessToken = response.accessToken;
        // call MS GRAPH to get basic user data
        callMsGraph(accessToken).then((response) => {
          setGraphData(response);
          let usedGraphData = response;
          // call MS GRAPH to get role of user
          callMsGraph_role(accessToken, response.id).then((response) => {
            setRoleData(response);
            getUserTokenFromBE(response, usedGraphData, usedTenantId);
          });
        });
        setTenantId(response.tenantId);
      })
      .catch((e) => {
        instance.acquireTokenPopup(request).then((response) => {
          callMsGraph(response.accessToken).then((response) =>
            setGraphData(response)
          );
          console.log(response);
        });
      });
  }

  useEffect(() => {
    if (graphData === null) {
      console.log(graphData);
      RequestProfileData();
    }
  }, [graphData]); // pass `value` as a dependency

  return (
    <>
      {/* <h5 className="card-title">Welcome {name}</h5> */}
      {graphData && roleData && tenantId && userObjectBE ? (
        <>
          <StudentPage />
        </>
      ) : (
        <>
          {/* You will be transferred to your school webpage soon. Please wait. */}
          {/* <SignOutButton/> */}
        </>
      )}
    </>
  );
}
