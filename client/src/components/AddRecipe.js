import axios from "axios";
import React, { useState, useEffect } from "react";
import { Alert, Button } from "react-bootstrap";
import cookbook from "../assets/cookbook.png";
import base from "../config";

export default function AddRecipe() {
  const [values, setValues] = useState({
    name: "",
    description: "",
    ingredients: "",
    category: "",
    instructions: "",
    error: "",
    redirect: false,
  });
  const [user, setUser] = useState({});
  const [categories, setCategories] = useState([]);
  const [img, setImg] = useState({});
  const [file, setFile] = useState(cookbook);

  useEffect(async () => {
    const user = await axios.get(`${base}/cache`);
    setUser(user.data);

    const categories = await axios.get(`${base}/categories`);
    setCategories(categories.data);
  }, []);

  const add = async () => {
    const newRecipe = new FormData();

    if (img) {
      newRecipe.append("img", img);
    }
    newRecipe.append("name", values.name);
    newRecipe.append("description", values.description);
    newRecipe.append("ingredients", values.ingredients);
    newRecipe.append("category", values.category);
    newRecipe.append("instructions", values.instructions);
    newRecipe.append("author", user._id);

    let response = await axios.post(`${base}/recipe/create`, newRecipe);

    if (response.data.error) {
      setValues({ ...values, error: response.data.error });
    } else {
      setValues({ ...values, error: "", redirect: true });
    }
  };

  if (values.redirect) {
    return window.location.assign("/myrecipes");
  }

  return (
    <div className="add">
      <div className="add-title">
        <h3>Add Recipe</h3>
      </div>

      <div className="image">
        <div>
          <img src={file} alt="add" width="200px" />
          <input
            type="file"
            id="file-upload"
            onChange={(e) => {
              setFile(URL.createObjectURL(e.target.files[0]));
              setImg(e.target.files[0]);
            }}
          />
        </div>
      </div>

      <div className="rest">
        <div>
          <div className="mb-3">
            <input
              type="text"
              className="form-control"
              id="exampleInputEmail1"
              placeholder="name"
              onChange={(e) => setValues({ ...values, name: e.target.value })}
            />
          </div>
          <div className="mb-3">
            <input
              type="text"
              className="form-control"
              id="exampleInputEmail1"
              placeholder="description"
              onChange={(e) =>
                setValues({ ...values, description: e.target.value })
              }
            />
          </div>
          <div className="mb-3">
            <input
              type="text"
              className="form-control"
              id="exampleInputEmail1"
              placeholder="ingredients"
              onChange={(e) =>
                setValues({ ...values, ingredients: e.target.value })
              }
            />
          </div>
          <div className="mb-3">
            <input
              type="text"
              className="form-control"
              id="exampleInputEmail1"
              placeholder="instructions"
              onChange={(e) =>
                setValues({ ...values, instructions: e.target.value })
              }
            />
          </div>
          <div className="mb-3">
            <input
              type="search"
              list="category"
              className="form-control"
              id="exampleInputEmail1"
              placeholder="category"
              onChange={(e) =>
                setValues({ ...values, category: e.target.value })
              }
            />

            <datalist id="category">
              {categories &&
                categories.map((v, i) => {
                  return <option key={i} value={v} />;
                })}
            </datalist>
          </div>
        </div>
      </div>

      <div className="add-buttons">
        <Button variant="outline-primary" onClick={add}>
          Add
        </Button>
        <Button
          variant="outline-danger"
          onClick={() => window.location.assign("/myrecipes")}
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
