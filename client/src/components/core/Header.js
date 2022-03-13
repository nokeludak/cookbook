import React, { useState, useEffect } from "react";
import cookbook from "../../assets/cookbook.png";
import base from "../../config";
import axios from "axios";
import { Button } from "react-bootstrap";
import { signout } from "../../services/auth-api";
import authHelper from "../../services/auth-helper";

export default function Header({ login }) {
  const [user, setUser] = useState({
    _id: "",
    name: "",
    email: "",
  });

  useEffect(async () => {
    let response = await axios.get(`${base}/cache`);

    setUser(response.data);
  }, [login]);

  const logout = () => {
    signout().then(() => {
      authHelper.clearToken(() => window.location.assign("/"));
    });
  };

  return (
    <div className="header">
      <div className="header-left" onClick={() => window.location.assign("/")}>
        <img src={cookbook} alt="cookbook-header" width="10%" />
        <h4>Cookbook</h4>
      </div>

      <div className="header-right">
        <Button
          variant="outline-dark"
          onClick={() => window.location.assign("/add")}
        >
          +
        </Button>
        <div className="dropdown show">
          <a
            className="btn btn-secondary dropdown-toggle"
            href=""
            role="button"
            id="dropdownMenuLink"
            data-toggle="dropdown"
            aria-haspopup="true"
            aria-expanded="false"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              fill="currentColor"
              className="bi bi-person-circle"
              viewBox="0 0 16 16"
            >
              <path d="M11 6a3 3 0 1 1-6 0 3 3 0 0 1 6 0z" />
              <path
                fillRule="evenodd"
                d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8zm8-7a7 7 0 0 0-5.468 11.37C3.242 11.226 4.805 10 8 10s4.757 1.225 5.468 2.37A7 7 0 0 0 8 1z"
              />
            </svg>
          </a>

          <div className="dropdown-menu" aria-labelledby="dropdownMenuLink">
            <a className="dropdown-item" href="/profile">
              My Profile
            </a>
            <a className="dropdown-item" href="/myrecipes">
              My Recipes
            </a>
            <a className="dropdown-item" onClick={logout}>
              Logout
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
