import axios from "axios";
import React, { useState, useEffect } from "react";
import { Alert, Button, Modal, ModalBody, ModalTitle } from "react-bootstrap";
import base from "../config";
import authHelper from "../services/auth-helper";

export default function MyProfile() {
  const [user, setUser] = useState({});
  const [modal, setModal] = useState(false);
  const [error, setError] = useState("");
  const [password, setPassword] = useState("");
  const [type, setType] = useState("password");
  const jwt = authHelper.isAuthenticated();

  const types = () => {
    if (type === "password") {
      setType("text");
    } else {
      setType("password");
    }
  };

  const remove = (params, token) => {
    return fetch(`${base}/user/${params.userId}`, {
      method: "DELETE",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: "Bearer " + token.t,
      },
    })
      .then((response) => response.json())
      .catch((err) => console.log(err));
  };

  useEffect(async () => {
    let response = await axios.get(`${base}/cache`);

    setUser(response.data);
  }, []);

  const deleteUser = async () => {
    let data = {
      email: user.email,
      password: password,
    };

    let response = await axios.post(`${base}/auth/signin`, data);
    if (response.data.error) {
      setError("Password is incorrect!");
    } else {
      remove({ userId: user._id }, { t: jwt.token }).then((data) => {
        if (data && data.error) {
          console.log(data.error);
        } else {
          authHelper.clearToken(() => console.log("deleted"));
          window.location.assign("/");
        }
      });
    }
  };

  return (
    <div className="my-profile">
      <div className="mp-main">
        <h2>{user.name}</h2>
        <Button
          variant="outline-primary"
          onClick={() => window.location.assign("/profile/edit")}
        >
          Edit
        </Button>
        <Button variant="outline-danger" onClick={() => setModal(true)}>
          Delete
        </Button>
        <Button
          variant="outline-success"
          onClick={() => window.location.assign("/")}
        >
          Back
        </Button>
      </div>

      <Modal show={modal}>
        <ModalTitle>Delete Account!</ModalTitle>

        <ModalBody>
          <div className="mb-3">
            <input
              type={type}
              className="form-control"
              id="exampleInputEmail1"
              placeholder="password"
              onChange={(e) => setPassword(e.target.value)}
            />
            <Button variant="outline-dark" onClick={types}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                fill="currentColor"
                className="bi bi-eye-fill"
                viewBox="0 0 16 16"
              >
                <path d="M10.5 8a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0z" />
                <path d="M0 8s3-5.5 8-5.5S16 8 16 8s-3 5.5-8 5.5S0 8 0 8zm8 3.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7z" />
              </svg>
            </Button>
          </div>

          <div
            className="modal-buttons"
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <Button variant="outline-danger" onClick={deleteUser}>
              Delete
            </Button>
            <Button variant="outline-success" onClick={() => setModal(false)}>
              Back
            </Button>
          </div>
          {error && (
            <Alert
              variant="danger"
              style={{
                marginLeft: "10%",
                marginRight: "10%",
                marginTop: "2rem",
              }}
            >
              {error}
            </Alert>
          )}
        </ModalBody>
      </Modal>
    </div>
  );
}
