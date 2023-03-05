import React, { useContext, useState, useEffect } from "react";
import userContext from "../contexts/userContext";
import { ProfileData } from "../components/ProfileData";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { library } from "@fortawesome/fontawesome-svg-core";
import { faPencil } from "@fortawesome/free-solid-svg-icons";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import { Form, FormText } from "react-bootstrap";

let url = "https://uni-canteen-backend.azurewebsites.net";

export default function CanteensAdminPage() {
  const { user, setUser } = useContext(userContext);
  const [canteens, setCanteens] = useState(null);
  const token = localStorage.getItem("token");
  const [isLoading, setIsLoading] = useState(false);
  const [open, setOpen] = React.useState(false);
  const [formValues, setFormValues] = React.useState({
    id: 0,
    name: "",
    address: "",
    contact: "",
    openingHours: "",
    school: {
      id: 0,
      address: "",
      contact: "",
      name: "",
    },
  });

  library.add(faPencil);
  function loadCanteens() {
    setIsLoading(true);

    const requestOptions = {
      headers: {
        token: token,
      },
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
  }

  useEffect(() => {
    loadCanteens();
  }, []);

  function editCanteen(canteen) {
    setOpen(true);
    setFormValues({
      id: canteen.id,
      name: canteen.name,
      address: canteen.address,
      contact: canteen.contact,
      openingHours: canteen.openingHours,
      school: {
        id: canteen.school.id,
        address: canteen.school.address,
        contact: canteen.school.contact,
        name: canteen.school.name,
      },
    });
  }

  const handleClose = () => {
    setOpen(false);
  };

  const hadnleChange = (e) => {
    const { name, value } = e.target;
    setFormValues({ ...formValues, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const send = JSON.stringify(formValues);
    const requestOptions = {
      method: "PUT",
      headers: {
        token: token,
        "Content-Type": "application/json",
      },
      body: send,
    };

    fetch(url + "/canteen/admin/updateCanteen", requestOptions)
      .then((response) => response.json())
      .then((data) => {
        loadCanteens();
      })
      .catch((err) => {
        console.log(err);
      });

    setOpen(false);
  };

  return (
    <div>
      {user.role == "STUDENT" || user.role == undefined ? (
        <div>YOU ARE NOT ADMIN</div>
      ) : (
        <div className="canteenContainer">
          {canteens != null ? (
            canteens.map((canteen, index) => (
              <div className="canteen">
                <div style={{color: ' #054b61'}}>
                <h4><strong>{canteen.name}</strong></h4>
                <p><strong>Address: </strong> {canteen.address}</p>
                <p><strong>Contact: </strong> {canteen.contact}</p>
                <p><strong>Opening hours:</strong> {canteen.openingHours}</p>
                </div>
                <div style={{flex: 1}}>
               
                  <FontAwesomeIcon key={canteen.id} icon="fa-solid fa-pencil" style={{
                        color: " #054b61",
                        marginTop: '1.5%',
                        marginLeft: '3%',
                        border: "none",
                      }} onClick={() => editCanteen(canteen)}/>
                </div>
                <Dialog
                  fullWidth
                  maxWidth="sm"
                  open={open}
                  onClose={handleClose}
                >
                  <DialogTitle
                    style={{ marginLeft: "auto", marginRight: "auto" }}
                  >
                    Edit {formValues.name}
                  </DialogTitle>
                  <DialogContent
                    style={{ marginLeft: "auto", marginRight: "auto" }}
                  >
                    <Form>
                      <div>
                        <label classname="form-label" htmlFor="form1">
                          Name of canteen
                        </label>
                        <br />
                        <TextField
                          type="text"
                          name="name"
                          value={formValues.name}
                          onChange={hadnleChange}
                          placeholder="Enter name"
                        />
                      </div>
                      <div>
                        <label classname="form-label" htmlFor="form2">
                          Address of canteen
                        </label>
                        <br />
                        <TextField
                          type="text"
                          name="address"
                          value={formValues.address}
                          onChange={hadnleChange}
                          placeholder="Enter address"
                        />
                      </div>
                      <div>
                        <label classname="form-label" htmlFor="form3">
                          Contact
                        </label>
                        <br />
                        <TextField
                          type="text"
                          name="contact"
                          value={formValues.contact}
                          onChange={hadnleChange}
                          placeholder="Enter contact info"
                        />
                      </div>
                      <div>
                        <label classname="form-label" htmlFor="form4">
                          Opening hours
                        </label>
                        <br />
                        <TextField
                          type="text"
                          name="openingHours"
                          value={formValues.openingHours}
                          onChange={hadnleChange}
                          placeholder="Enter opening hours"
                        />
                      </div>
                      <Button
                        style={{
                          paddingLeft: 2.5 + "rem",
                          paddingRight: 2.5 + "rem",
                          width: "100%",
                          marginTop: "3%",
                        }}
                        onClick={handleSubmit}
                      >
                        Save
                      </Button>

                      <DialogActions>
                        <Button
                          color="warning"
                          style={{
                            paddingLeft: 2.5 + "rem",
                            paddingRight: 2.5 + "rem",
                            width: "100%",
                          }}
                          onClick={handleClose}
                        >
                          Cancel
                        </Button>
                      </DialogActions>
                    </Form>
                  </DialogContent>
                </Dialog>
              </div>
            ))
          ) : (
            <> </>
          )}
        </div>
      )}
    </div>
  );
}
