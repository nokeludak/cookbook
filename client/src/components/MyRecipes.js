import axios from "axios";
import React, { useState, useEffect } from "react";
import { Button, Modal, ModalBody, ModalTitle } from "react-bootstrap";
import base from "../config";

export default function MyRecipes() {
  const [recipes, setRecipes] = useState([]);
  const [user, setUser] = useState({});
  const [modal, setModal] = useState(false);
  const [id, setId] = useState("");

  useEffect(async () => {
    let cache = await axios.get(`${base}/cache`);
    setUser(cache.data);

    let response = await axios.get(`${base}/recipe/author/${cache.data._id}`);

    response.data.map((v, i) => {
      if (v.rating.length < 3) {
        v.rating = "Not Rated Yet";
      } else {
        let avg = 0;
        v.rating.map((r, j) => {
          avg += r;
        });
        avg /= v.rating.length;
        v.rating = avg;
      }

      v.created = v.created.split("T");
      v.temp = v.created[0];
      v.created = v.temp;
      console.log(v.created);
    });

    setRecipes(response.data);
  }, []);

  const deleteRecipe = async () => {
    let response = await axios.delete(`${base}/recipe/${id}`);

    if (response.data.error) {
      console.log(response.data.error);
    } else {
      setModal(false);
      window.location.reload();
    }
  };

  return (
    <div className="my">
      <div className="my-title">
        <h3>My Recipes</h3>
      </div>

      <div className="my-main">
        <table>
          <thead>
            <tr>
              <th>Recipe</th>
              <th>Rating</th>
              <th>Date</th>
              <th>Category</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {recipes &&
              recipes.map((v, i) => {
                return (
                  <tr key={i}>
                    <td>{v.name}</td>
                    <td>Not radet</td>
                    <td>{v.created}</td>
                    <td>{v.category}</td>
                    <td>
                      <a href={"/myrecipe/edit/" + v._id}>Edit</a>{" "}
                      <a href={"/recipe/" + v._id}>View</a>{" "}
                      <a
                        onClick={() => {
                          setModal(true);
                          setId(v._id);
                        }}
                      >
                        Delete
                      </a>
                    </td>
                  </tr>
                );
              })}
          </tbody>
        </table>
      </div>

      <Modal show={modal}>
        <ModalTitle>Delete Recipe!?</ModalTitle>

        <ModalBody>
          <p>Are You Sure You Want to delete this recipe?</p>

          <div
            className="modal-buttons"
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <Button variant="outline-danger" onClick={deleteRecipe}>
              Yes
            </Button>
            <Button variant="outline-primary" onClick={() => setModal(false)}>
              No
            </Button>
          </div>
        </ModalBody>
      </Modal>
    </div>
  );
}
