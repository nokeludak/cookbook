import React, { useState, useEffect } from "react";
import {
  Alert,
  Button,
  Modal,
  ModalTitle,
  ModalBody,
  ModalFooter,
} from "react-bootstrap";
import cookbook from "../../assets/cookbook.png";
import { signin } from "../../services/auth-api";
import auth from "../../services/auth-helper";

export default function Signin({ setLogin, login, setCreate }) {
  const [values, setValues] = useState({
    email: "",
    password: "",
    error: "",
  });
  const [type, setType] = useState("password");

  useEffect(() => {
    if (sessionStorage.getItem("token")) setLogin(false);
  }, [login]);

  const types = () => {
    if (type === "password") {
      setType("text");
    } else {
      setType("password");
    }
  };

  const loginIntoApp = async () => {
    const user = {
      email: values.email || undefined,
      password: values.password || undefined,
    };

    signin(user).then((data) => {
      if (data.error) {
        setValues({ ...values, error: data.error });
      } else {
        auth.authenticate(data, () => {
          setValues({ ...values, error: "" });
          setLogin(false);
        });
      }
    });
  };

  return (
    <div>
      <Modal show={login}>
        <ModalTitle>
          <div className="modal-title">
            <h2>Login</h2>
          </div>
        </ModalTitle>

        <ModalBody>
          <div className="modal-main">
            <div className="modal-left">
              <img src={cookbook} alt="cookbook" width="50%" height="50%" />
            </div>

            <div className="modal-right">
              <div className="mb-3" id="modal-password">
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
            </div>
          </div>

          {values.error && <Alert variant="danger">{values.error}</Alert>}
        </ModalBody>

        <ModalFooter>
          <div className="modal-bottom">
            <div className="modal-footer-top">
              <Button variant="outline-primary" onClick={loginIntoApp}>
                Login
              </Button>
            </div>

            <div className="modal-footer-bottom">
              <p>Dont Have an Account Yet?</p>
              <Button
                variant="outline-primary"
                onClick={() => {
                  setCreate(true);
                  setLogin(false);
                }}
              >
                Create Account
              </Button>
            </div>
          </div>
        </ModalFooter>
      </Modal>
    </div>
  );
}
