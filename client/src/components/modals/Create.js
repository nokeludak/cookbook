import React, { useState } from "react";
import base from "../../config";
import {
  Alert,
  Button,
  Modal,
  ModalTitle,
  ModalBody,
  ModalFooter,
} from "react-bootstrap";
import cookbook from "../../assets/cookbook.png";
import axios from "axios";

export default function Create({ setCreate, create, setLogin }) {
  const [values, setValues] = useState({
    name: "",
    email: "",
    password: "",
    repeatPassword: "",
    error: "",
  });
  const [type, setType] = useState("password");

  const types = () => {
    if (type === "password") {
      setType("text");
    } else {
      setType("password");
    }
  };

  const createAccount = async () => {
    const user = {
      name: values.name || undefined,
      email: values.email || undefined,
      password: values.password || undefined,
    };

    if (values.repeatPassword !== values.password) {
      return setValues({ ...values, error: "Passwords don't match" });
    }

    let resp = await axios.post(`${base}/user/create`, user);

    if (resp.data.error) {
      return setValues({ ...values, error: resp.data.error });
    } else {
      setValues({ ...values, error: "" });
      setCreate(false);
      setLogin(true);
    }
  };

  return (
    <div>
      <Modal show={create}>
        <ModalTitle>
          <div className="modal-title">
            <h2>Create Account</h2>
          </div>
        </ModalTitle>

        <ModalBody>
          <div className="modal-main">
            <div className="modal-left">
              <img src={cookbook} alt="cookbook" width="50%" height="50%" />
            </div>

            <div className="modal-right">
              <div className="mb-3">
                <input
                  type="text"
                  className="form-control"
                  id="exampleInputEmail1"
                  placeholder="name"
                  onChange={(e) =>
                    setValues({ ...values, name: e.target.value })
                  }
                />
              </div>

              <div className="mb-3">
                <input
                  type="text"
                  className="form-control"
                  id="exampleInputEmail1"
                  placeholder="email"
                  onChange={(e) =>
                    setValues({ ...values, email: e.target.value })
                  }
                />
              </div>

              <div className="mb-3">
                <input
                  type={type}
                  className="form-control"
                  id="exampleInputEmail1"
                  placeholder="password"
                  onChange={(e) =>
                    setValues({ ...values, password: e.target.value })
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
                  placeholder="repeat a password"
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

          {values.error && <Alert variant="danger">{values.error}</Alert>}
        </ModalBody>

        <ModalFooter>
          <div className="modal-bottom">
            <div className="modal-footer-top">
              <Button variant="outline-primary" onClick={createAccount}>
                Create Account
              </Button>
            </div>

            <div className="modal-footer-bottom">
              <p>Already Have an Acoount</p>
              <Button
                variant="outline-primary"
                onClick={() => {
                  setCreate(false);
                  setLogin(true);
                }}
              >
                Login
              </Button>
            </div>
          </div>
        </ModalFooter>
      </Modal>
    </div>
  );
}
