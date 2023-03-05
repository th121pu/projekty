import React, { useContext, useState, useEffect } from "react";
import userContext from "../contexts/userContext";
import { ProfileData } from "../components/ProfileData";

let url = "https://uni-canteen-backend.azurewebsites.net";

export default function CanteensPage() {
  const { user, setUser } = useContext(userContext);
  const [canteens, setCanteens] = useState(null);
  const token = localStorage.getItem("token");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    const requestOptions = {
      headers: { token: token },
    };

    fetch(url + "/canteen/getAllCanteens", requestOptions)
      .then((response) => response.json())
      .then((data) => {
        setCanteens(data);
        setIsLoading(true);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []); // See Note 2

  return (
    <div className="canteenContainer">
      {canteens != null ? (
        canteens.map((canteen) => (
          <div className="canteen">
            <div style={{color: ' #054b61'}}>
                <h4><strong>{canteen.name}</strong></h4>
                <p><strong>Address: </strong> {canteen.address}</p>
                <p><strong>Contact: </strong> {canteen.contact}</p>
                <p><strong>Opening hours:</strong> {canteen.openingHours}</p>
                </div>
          </div>
        ))
      ) : (
        <></>
      )}
    </div>
  );
}
