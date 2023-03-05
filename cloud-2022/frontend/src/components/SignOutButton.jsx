import React from "react";
import { useMsal } from "@azure/msal-react";
import Button from "react-bootstrap/Button";
import { useNavigate } from "react-router-dom";


/**
 * Renders a button which, when selected, will open a popup for logout
 */
export const SignOutButton = () => {
    const { instance } = useMsal();
    let navigate = useNavigate();

    function handleLogout(instance) {
        console.log('log out started');
        instance.logoutPopup().then(() => {
            console.log('teraz')
            navigate("../", { replace: true });
        }).catch(e => {
            console.error(e);
        });
    }

    return (
        <Button variant="secondary" className="ml-auto" onClick={() => handleLogout(instance)}>Sign out using Popup</Button>
    );
}