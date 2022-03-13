import axios from "axios";
import React, { useState, useEffect } from "react";
import { Button, Alert } from "react-bootstrap";
import base from "../config";
import authHelper from "../services/auth-helper";

export default function EditProfile() {
  const [user, setUser] = useState({});
  const [values, setValues] = useState({
    name: "",
    email: "",
    newPassword: "",
    repeatPassword: "",
    error: "",
    redirect: false,
  });
  const [type, setType] = useState("password");
  const jwt = authHelper.isAuthenticated();

  const types = () => {
    if (type === "password") {
      setType("text");
    } else {
      setType("password");
    }
  };

  useEffect(async () => {
    let response = await axios.get(`${base}/cache`);
    setUser(response.data);
  }, []);

  const update = (params, token, user) => {
    return fetch(`${base}/user/${params.userId}`, {
      method: "PUT",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: "Bearer " + token.t,
      },
      body: JSON.stringify(user),
    })
      .then((response) => response.json())
      .catch((err) => console.log(err));
  };

  const editProfile = async () => {
    if (values.newPassword !== "") {
      if (values.newPassword !== values.repeatPassword) {
        setValues({ ...values, error: "Passwords don't match" });
      } else {
        let data = {
          _id: user._id,
          name: values.name || user.name,
          email: values.email || user.email,
          password: values.newPassword,
        };

        update({ userId: user._id }, { t: jwt.token }, data).then(
          (response) => {
            if (response.error) {
              setValues({ ...values, error: response.error });
            } else {
              setValues({ ...values, error: "", redirect: true });
            }
          }
        );
      }
    } else {
      let data = {
        _id: user._id,
        name: values.name || user.name,
        email: values.email || user.email,
      };

      update({ userId: user._id }, { t: jwt.token }, data).then((response) => {
        if (response.error) {
          setValues({ ...values, error: response.error });
        } else {
          setValues({ ...values, error: "", redirect: true });
        }
      });
    }
  };

  if (values.redirect) {
    return window.location.assign("/profile");
  }

  return (
    <div className="add">
      <div className="add-title">
        <h3>Edit Profile</h3>
      </div>

      <div className="rest">
        <div>
          <div className="mb-3">
            <input
              type="text"
              className="form-control"
              id="exampleInputEmail1"
              placeholder="name"
              defaultValue={user.name}
              onChange={(e) => setValues({ ...values, name: e.target.value })}
            />
          </div>
          <div className="mb-3">
            <input
              type="text"
              className="form-control"
              id="exampleInputEmail1"
              defaultValue={user.email}
              placeholder="email"
              onChange={(e) => setValues({ ...values, email: e.target.value })}
            />
          </div>

          <div className="mb-3">
            <input
              type={type}
              className="form-control"
              id="exampleInputEmail1"
              placeholder="new password"
              onChange={(e) =>
                setValues({ ...values, newPassword: e.target.value })
              }
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

          <div className="mb-3">
            <input
              type={type}
              className="form-control"
              id="exampleInputEmail1"
              placeholder="repeat new password"
              onChange={(e) =>
                setValues({ ...values, repeatPassword: e.target.value })
              }
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
        </div>
      </div>

      <div className="add-buttons">
        <Button variant="outline-primary" onClick={editProfile}>
          Edit
        </Button>
        <Button
          variant="outline-danger"
          onClick={() => window.location.assign("/profile")}
        >
          Back
        </Button>
      </div>

      {values.error && (
        <Alert
          variant="danger"
          style={{ marginLeft: "35%", marginRight: "35%" }}
        >
          {values.error}
        </Alert>
      )}
    </div>
  );
}
