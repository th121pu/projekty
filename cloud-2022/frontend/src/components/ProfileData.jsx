import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser } from "@fortawesome/free-solid-svg-icons";
import { library } from "@fortawesome/fontawesome-svg-core";
/**
 * Renders information about the user obtained from Microsoft Graph
 */
export const ProfileData = (props) => {
    library.add(faUser);

    return (
        <div id="profile-div" className="profile container">
            <div className="icon">

                <FontAwesomeIcon
                style={{ color: "#054b61"}}
                    icon="fa-solid fa-user" size="10x"/>
            </div>
            <div className="student">
                <div className="text" style={{ color: "#054b61"}}>
              <div className="title">
                <p><strong>Username: </strong> </p>
                <p><strong>Id: </strong></p>
                <p><strong>Email: </strong> </p>
                <p><strong>School: </strong></p>
                <p><strong>ISIC: </strong> </p>
                <p><strong>Role: </strong></p>
                <p><strong>Account balance: </strong> </p>
                </div>
                <div>
                <p> {props?.userObjectBE.username}</p>
                <p> {props?.userObjectBE.id}</p>
                <p> {props?.userObjectBE.alternativeEmail}</p>
                <p> {props?.userObjectBE.school.name}</p>
                <p> {props?.userObjectBE.isic}</p>
                <p> {props?.userObjectBE.role}</p>
                <p> {" "}
                      {(Math.round(props?.userObjectBE.accountBalance * 100) / 100).toFixed(2)}
                      €{" "}</p>
                </div>
                </div>
            </div>
    
</div>
    );
};