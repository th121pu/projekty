import React, { useContext, useEffect, useState } from "react";
import userContext from "../contexts/userContext";
import { Nav } from "react-bootstrap";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import cardContext from "../contexts/cardContext";
import { library } from "@fortawesome/fontawesome-svg-core";
import { faPencil, faTrashCan } from "@fortawesome/free-solid-svg-icons";
import Button from "@mui/material/Button";
import { useNavigate } from "react-router-dom";
import Moment from "moment";

let url = "https://uni-canteen-backend.azurewebsites.net";

export default function MenuAdminPage() {
  const { user, setUser } = useContext(userContext);
  const [canteens, setCanteens] = useState(null);
  const token = localStorage.getItem("token");
  const [isLoading, setIsLoading] = useState(false);
  const [number, setNumber] = useState(1);
  const [menu, setMenu] = useState([]);
  const [shop, setShop] = useState([]);
  const [price, setPrice] = useState(0);
  const [canteenName, setCanteenName] = useState(null);
  const { card, setCard } = useContext(cardContext);
  const [date, setDate] = useState(
    new Date().getFullYear() +
      "-" +
      (new Date().getMonth() + 1) +
      "-" +
      new Date().getDate()
  );
  const [openNotify, setOpenNotify] = React.useState(false);
  const [openAdd, setOpenAdd] = React.useState(false);
  const [openEdit, setOpenEdit] = React.useState(false);
  const [openDelete, setOpenDelete] = React.useState(false);
  const [message, setMessage] = React.useState("");
  const [itemDelete, setItemDelete] = React.useState(0);
  const [newItem, setNewItem] = React.useState({
    canteenId: 0,
    menuName: "",
    price: 0,
    date: "",
    category: "",
  });

  library.add(faTrashCan);
  useEffect(() => {
    setIsLoading(true);
    const requestOptions = {
      headers: { token: token },
    };
    fetch(url + "/canteen/getAllCanteens", requestOptions)
      .then((response) => response.json())
      .then((data) => {
        console.log("GET ALL CANTEENS");
        console.log(data);
        setCanteens(data);
        getMenu(data[0].id);

        var today = new Date(),
          day =
            today.getFullYear() +
            "-" +
            (today.getMonth() + 1) +
            "-" +
            today.getDate();
        setDate(day);

        handleCanteen(data[0].id, data[0].name);
        setIsLoading(true);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setMessage(value);
  };
  const handleChangeItem = (e) => {
    const { name, value } = e.target;
    setNewItem({ ...newItem, [name]: value });
  };

  function getMenu(id) {
    const requestOptions = {
      headers: { token: token },
    };
    fetch(
      url + "/canteen-menu/getCanteenMenuWithRedis?id=" + id + "&date=" + date,
      requestOptions
    )
      .then((response) => response.json())
      .then((data) => {
        let response = data;
        setMenu(response);
        console.log("menuuu", menu);
      })
      .catch((err) => {
        console.log(err);
        setMenu([]);
      });
  }

  function handleCanteen(id, name) {
    console.log("id", id);
    setNumber(id);

    setPrice(0);
    setCanteenName(name);
    getMenu(id);
  }

  function handleDate(date) {
    console.log(date);

    setPrice(0);
    setDate(date);
    const requestOptions = {
      headers: { token: token },
    };
    fetch(
      url +
        "/canteen-menu/getCanteenMenuWithRedis?id=" +
        number +
        "&date=" +
        date,
      requestOptions
    )
      .then((response) => response.json())
      .then((data) => {
        let response = data;
        //setMenu(data);
        setMenu(response);
        console.log("menuuu", menu);
      })
      .catch((err) => {
        setMenu([]);
        console.log(err);
      });
  }

  const handleClickOpenNotify = () => {
    setOpenNotify(true);
  };
  const handleCloseNotify = () => {
    setOpenNotify(false);
  };
  const handleSubmitNotify = () => {
    console.log("Submit");

    const requestOptions = {
      headers: { token: token },
    };
    fetch(url + "/sb/notifyUsers?message=" + message, requestOptions)
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        alert("Notification send!");
      })
      .catch((err) => {
        console.log(err);
      });
    handleCloseNotify();
  };

  const handleClickOpenAdd = () => {
    setNewItem({
      canteenId: number,
      menuName: "",
      price: 0,
      date: date,
      category: "",
    });
    setOpenNotify(false);
    setOpenAdd(true);
  };
  const handleCloseAdd = () => {
    setOpenAdd(false);
  };

  const handleSubmitAdd = () => {
    console.log("Add");
    console.log("new item", newItem);
    const requestOptions = {
      method: "POST",
      headers: { token: token },
    };
    fetch(
      url +
        "/canteen-menu/admin/addCanteenMenu?canteenId=" +
        newItem.canteenId +
        "&menuName=" +
        newItem.menuName +
        "&price=" +
        newItem.price +
        "&date=" +
        newItem.date +
        "&category=" +
        newItem.category,
      requestOptions
    )
      .then((response) => response.json())
      .then((data) => {
        handleDate(date);
        console.log(data);
      })
      .catch((err) => {
        setMenu(null);
        console.log(err);
      });
    setOpenAdd(false);
    setNewItem({
      canteenId: 0,
      menuName: "",
      price: 0,
      date: "",
      category: "",
    });
  };
  function handleDeleteButton(id) {
    setOpenDelete(true);
    setItemDelete(id);
  }
  function handleCloseDelete() {
    setOpenDelete(false);
    setItemDelete(0);
  }
  function handleDelete() {
    console.log("delete this");
    const requestOptions = {
      method: "DELETE",
      headers: { token: token },
    };
    fetch(
      url +
        "/canteen-menu/admin/deleteCanteenMenu?canteenId=" +
        number +
        "&menuId=" +
        itemDelete +
        "&date=" +
        date,
      requestOptions
    )
      .then((response) => response.json())
      .then((data) => {
        handleDate(date);
        console.log(data);
      })
      .catch((err) => {
        setMenu(null);
        console.log(err);
      });
    handleCloseDelete();
  }

  return (
    <div>
      {user.role == "STUDENT" || user.role == undefined ? (
        <div>YOU ARE NOT ADMIN</div>
      ) : (
        <div>
          {canteens != null ? (
            <>
              <div className="menuContainer">
                <div className="sidebar">
                  <Nav className="flex-column">
                    {canteens.map((canteen) => (
                      <div
                        className={
                          "canteen-text-box " +
                          (canteen.id == number ? "selectedCanteen" : "")
                        }
                        onClick={() => handleCanteen(canteen.id, canteen.name)}
                      >
                        <Nav.Link key={canteen.id} className="canteen-text">
                          {canteen.name}
                        </Nav.Link>
                      </div>
                    ))}
                  </Nav>
                </div>

                <div className="canteen-days">
                  <div style={{ display: "flex" }}>
                    <h2 style={{ color: "#054b61", flex: 1 }}>{canteenName}</h2>
                    <Button
                      style={{
                        flex: 0.3,
                        color: "white",
                        backgroundColor: "#054b61",
                        width: "100%",
                        norder: "none",
                        borderRadius: "10px",
                        height: "2.4em",
                      }}
                      onClick={handleClickOpenNotify}
                    >
                      Add announcement
                    </Button>
                  </div>
                  <div className="box-days">
                    {Array.from(Array(3), (e, i) => {
                      let today = new Date();
                      let nextDay = new Date(today);
                      nextDay.setDate(today.getDate() + i);

                      let dateDisplay =
                        nextDay.getFullYear() +
                        "-" +
                        (nextDay.getMonth() + 1) +
                        "-" +
                        nextDay.getDate();

                      Moment.locale("en");

                      return (
                        <button
                          className={
                            "date-text-box " +
                            (dateDisplay == date ? "selectedCanteen" : "")
                          }
                          key={i}
                          onClick={() => handleDate(dateDisplay)}
                        >
                          {nextDay.toLocaleDateString("en", {
                            weekday: "long",
                          })}{" "}
                          {Moment(nextDay).format("D.M.yyyy")}
                        </button>
                      );
                    })}
                  </div>

                  {menu != null && menu.length > 0 ? (
                    <>
                      <div class="menu-box-container">
                        <div style={{ display: "flex" }}>
                          <h3 style={{ flex: 1 }}> Menu</h3>
                          <div style={{ display: "flex" }}>
                            <button
                              style={{
                                display: "flex",
                                justifyContent: "flex-end",
                              }}
                              className="shop-button"
                              onClick={handleClickOpenAdd}
                            >
                              Add food
                            </button>
                          </div>
                        </div>
                        <hr
                          style={{
                            color: "white",
                            backgroundColor: "#white",
                            height: 5,
                          }}
                        />
                        {menu.map((food, index) =>
                          food.map((item, index) => {
                            return (
                              <div>
                                {index === 0 && (
                                  <h4>{item.food.category.name}</h4>
                                )}

                                <div class="rowContainer">
                                  <p class="menu-box-text" key={item.id}>
                                    {item.food.name}{" "}
                                    <p class="menu-box-text rightAl">
                                      {(
                                        Math.round(item.price * 100) / 100
                                      ).toFixed(2)}
                                      €{"  "}
                                      <button
                                        key={index}
                                        style={{
                                          fontSize: "0.9em",
                                          borderRadius: "45%",
                                          border: "none",
                                        }}
                                        onClick={() =>
                                          handleDeleteButton(item.id)
                                        }
                                      >
                                        <FontAwesomeIcon
                                          style={{
                                            color: " #054b61",
                                            background: "#ffffff",
                                          }}
                                          key={item.food.id}
                                          icon="fa-solid fa-trash-can"
                                        />
                                      </button>{" "}
                                    </p>
                                  </p>
                                </div>
                              </div>
                            );
                          })
                        )}
                      </div>
                    </>
                  ) : (
                    <div class="menu-box-container">
                      <div style={{ display: "flex" }}>
                        <h3 style={{ flex: 1 }}> Menu</h3>
                        <div style={{ display: "flex" }}>
                          <button
                            style={{
                              display: "flex",
                              justifyContent: "flex-end",
                            }}
                            className="shop-button"
                            onClick={handleClickOpenAdd}
                          >
                            Add food
                          </button>
                        </div>
                      </div>

                      <hr
                        style={{
                          color: "white",
                          backgroundColor: "#white",
                          height: 5,
                        }}
                      />
                      <p class="menu-box-text">
                        This canteen is closed on chosen day.
                      </p>
                    </div>
                  )}
                  <div>
                    <div>
                      <Dialog
                        open={openDelete}
                        onClose={handleCloseDelete}
                        aria-labelledby="alert-dialog-title"
                        aria-describedby="alert-dialog-description"
                      >
                        <DialogTitle id="alert-dialog-title">
                          {"Do you want to delete this item?"}
                        </DialogTitle>
                        <DialogContent></DialogContent>
                        <DialogActions>
                          <Button onClick={handleCloseDelete}>No</Button>
                          <Button onClick={handleDelete} autoFocus>
                            Yes
                          </Button>
                        </DialogActions>
                      </Dialog>
                    </div>{" "}
                  </div>
                </div>
                <Dialog open={openAdd} onClose={handleCloseAdd}>
                  <DialogTitle>New food</DialogTitle>
                  <DialogContent>
                    <TextField
                      autoFocus
                      margin="dense"
                      id="name_food"
                      label="Name of food"
                      type="text"
                      name="menuName"
                      fullWidth
                      value={newItem.menuName}
                      onChange={handleChangeItem}
                      variant="standard"
                    />
                    <TextField
                      autoFocus
                      margin="dense"
                      id="category_food"
                      name="category"
                      label="Category of food"
                      type="text"
                      fullWidth
                      value={newItem.category}
                      onChange={handleChangeItem}
                      variant="standard"
                    />
                    <TextField
                      autoFocus
                      margin="dense"
                      id="price-food"
                      name="price"
                      label="Price"
                      type="number"
                      fullWidth
                      value={newItem.price}
                      onChange={handleChangeItem}
                      variant="standard"
                    />
                  </DialogContent>
                  <DialogActions>
                    <Button onClick={handleCloseAdd}>Cancel</Button>
                    <Button onClick={handleSubmitAdd}>Add</Button>
                  </DialogActions>
                </Dialog>

                <Dialog open={openNotify} onClose={handleCloseNotify}>
                  <DialogTitle>Announcement</DialogTitle>
                  <DialogContent>
                    <DialogContentText>
                      Write an announcement. It will be sent to all students.
                    </DialogContentText>
                    <TextField
                      autoFocus
                      margin="dense"
                      id="text"
                      label="Text"
                      type="text"
                      fullWidth
                      value={message}
                      onChange={handleChange}
                      variant="standard"
                    />
                  </DialogContent>
                  <DialogActions>
                    <Button onClick={handleCloseNotify}>Cancel</Button>
                    <Button onClick={handleSubmitNotify}>Send</Button>
                  </DialogActions>
                </Dialog>
              </div>
            </>
          ) : (
            <></>
          )}
        </div>
      )}
    </div>
  );
}
