import React, { useContext } from "react";
import logo from "../images/logo_blue.jpg";
import { useHistory } from "react-router-dom";
import authContext from "../contexts/authContext";
import userContext from "../contexts/userContext";
import currencyContext from "../contexts/currencyContext";
import { FaUserAlt } from "react-icons/fa";

import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogTitle from "@mui/material/DialogTitle";
import Slide from "@mui/material/Slide";

import clsx from "clsx";
import { styled } from "@mui/system";
import { useSwitch } from "@mui/base/SwitchUnstyled";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const blue = {
  700: "#0059B2",
};

const grey = {
  400: "white",
  800: "white",
};

const SwitchRoot = styled("span")`
  display: inline-block;
  position: relative;
  width: 64px;
  height: 36px;
  padding: 8px;
`;

const SwitchInput = styled("input")`
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  opacity: 0;
  z-index: 1;
  margin: 0;
  cursor: pointer;
`;

const SwitchThumb = styled("span")`
  position: absolute;
  display: block;
  background-color: ${blue[700]};
  width: 30px;
  height: 30px;
  border-radius: 8px;
  top: 3px;
  left: 4px;
  transition: transform 150ms cubic-bezier(0.4, 0, 0.2, 1);

  &::before {
    display: block;
    content: "";
    width: 100%;
    height: 100%;
    background-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' version='1.1' height='50px' width='120px'><text x='10' y='20' fill='white' font-size='1em'>$</text></svg>");
  }

  &.focusVisible {
    background-color: #79b;
  }

  &.checked {
    transform: translateX(24px);

    &::before {
      background-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' version='1.1' height='50px' width='120px'><text x='10' y='20' fill='white' font-size='1em'>€</text></svg>");
    }
  }
`;

const SwitchTrack = styled("span")(
  ({ theme }) => `
  background-color: ${theme.palette.mode === "dark" ? grey[800] : grey[400]};
  border-radius: 4px;
  width: 100%;
  height: 100%;
  display: block;
`
);

function handleSwitchChange(e) {
  console.log("a");
  // Add actions here for when the switch is triggered
}

function MUISwitch(props) {
  const { currency, setCurrency } = useContext(currencyContext);
  const { getInputProps, checked, disabled, focusVisible } = useSwitch(props);
  const stateClasses = {
    checked,
    disabled,
    focusVisible,
  };

  React.useEffect(() => {
    if (checked) setCurrency("EUR");
    else setCurrency("USD");
  });

  return (
    <SwitchRoot className={clsx(stateClasses)}>
      <SwitchTrack>
        <SwitchThumb className={clsx(stateClasses)} />
      </SwitchTrack>
      <SwitchInput {...getInputProps()} aria-label="Demo switch" />
    </SwitchRoot>
  );
}

export default function Header() {
  let history = useHistory();
  const { authenticated, setAuthenticated } = useContext(authContext);
  const { user } = useContext(userContext);
  const { currency, setCurrency } = useContext(currencyContext);

  console.log(user);
  function goLogin() {
    history.push("/login");
  }

  function goRegister() {
    history.push("/register");
  }

  function goProfile() {
    history.push("/profile");
  }

  function goLogout() {
    setOpen(false);
    setAuthenticated(false);
  }

  function goGome() {
    history.push("/");
  }

  function goSub() {
    history.push("/subscription")
  }

  const [open, setOpen] = React.useState(false);

  const openDialogLogout = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <header className="App-header">
      <div className="flexOne">
        <button
          className="hoverState"
          style={{
            fontSize: "0.65em",
            marginLeft: "5%",
          }}
          onClick={() => goGome()}
        >
          HOME
        </button>

        <button
          className="hoverState"
          style={{
            fontSize: "0.65em",
            marginLeft: "6%",
          }}
          onClick={() => goSub()}
        >
          SUBSCRIPTION
        </button>
      </div>
      <div
        className="flexOne"
        style={{
          justifyContent: "center",
        }}
      >
        <img
          onClick={() => goGome()}
          style={{
            justifyContent: "center",
            cursor: "pointer",
            width: "26%",
            minWidth: "90px",
            margin: "6px 0",
          }}
          src={logo}
          alt="Logo"
        />
      </div>
      <div
        className="flexOne"
        style={{
          justifyContent: "right",
        }}
      >
        <div className="switchClass">
          <MUISwitch defaultChecked={currency === "EUR"} />
        </div>
        <div
          onClick={goProfile}
          style={{
            alignItems: "center",
            marginRight: "4%",
            cursor: "pointer",
          }}
          className={authenticated ? "displayed" : "notDisplayed"}
        >
          <FaUserAlt
            style={{
              cursor: "pointer",
            }}
          />
          <p style={{ fontSize: "0.55em", margin: 0, paddingLeft: "0.75em" }} className = "remove">
            {" "}
            {user.name}
          </p>
        </div>
        <button
          className="displayed2"
          style={{
            marginRight: "3.5%",
            fontSize: "0.65em",
            color: "#3f47cc",
            padding: "3px 0.8em",
            borderRadius: "10px",
            backgroundColor: "white",
          }}
          onClick={authenticated ? openDialogLogout : goLogin}
        >
          {authenticated ? "Log out" : "Log in"}
        </button>

        <button
          className={authenticated ? "notDisplayed" : "displayed2"}
          style={{
            marginRight: "4%",
            cursor: "pointer",
            fontSize: "0.65em",
            color: "white",
            padding: "3px 15px",
            borderRadius: "10px",
            backgroundColor: "#3f47cc",
          }}
          onClick={goRegister}
        >
          {"Sign up"}
        </button>
      </div>
      {/* popud dialog for logout confirmation */}
      <Dialog
        open={open}
        TransitionComponent={Transition}
        keepMounted
        onClose={handleClose}
        aria-describedby="alert-dialog-slide-description"
      >
        <DialogTitle>{"Do you really want to log out?"}</DialogTitle>

        <DialogActions style={{ justifyContent: "center" }}>
          <Button onClick={handleClose}>No</Button>
          <Button onClick={goLogout}>Yes</Button>
        </DialogActions>
      </Dialog>
    </header>
  );
}
