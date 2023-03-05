import { graphConfig } from "./authConfig";

/**
 * Attaches a given access token to a Microsoft Graph API call. Returns information about the user
 */
export async function callMsGraph(accessToken) {
  const headers = new Headers();
  const bearer = `Bearer ${accessToken}`;

  headers.append("Authorization", bearer);

  const options = {
    method: "GET",
    headers: headers,
  };

  return fetch(graphConfig.graphMeEndpoint, options)
    .then((response) => response.json())
    .catch((error) => console.log(error));
}

/**
 * Get role of user
 */
export async function callMsGraph_role(accessToken, id) {
  const headers = new Headers();
  const bearer = `Bearer ${accessToken}`;

  console.log("finding role");

  headers.append("Authorization", bearer);

  const options = {
    method: "GET",
    headers: headers,
  };

  return fetch(
    "https://graph.microsoft.com/v1.0/users/" + id + "/appRoleAssignments",
    options
  )
    .then((response) => {
      return response.json();
    })
    .then(function (data) {
      console.log(data);
      return data.value;
    })
    .catch((error) => console.log(error));
}
