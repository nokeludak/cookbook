import axios from "axios";
import React, { useState, useEffect } from "react";
import { Alert, Button } from "react-bootstrap";
import { useParams } from "react-router";
import cookbook from "../assets/cookbook.png";
import base from "../config";

export default function EditRecipe() {
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
  const [recipe, setRecipe] = useState({});
  const { recipeId } = useParams();

  useEffect(async () => {
    const user = await axios.get(`${base}/cache`);
    setUser(user.data);

    const categories = await axios.get(`${base}/categories`);
    setCategories(categories.data);

    const response = await axios.get(`${base}/recipe/${recipeId}`);
    setRecipe(response.data);

    if (response.data.picture) {
      setFile("http://localhost:5000/uploads/" + response.data.picture);
    }
  }, []);

  const add = async () => {
    const newRecipe = new FormData();

    const data = {
      name: values.name || recipe.name,
      description: values.description || recipe.description,
      ingredients: values.ingredients || recipe.ingredients,
      picture: recipe.picture,
      category: values.category || recipe.category,
      instructions: values.instructions || recipe.instructions,
    };

    if (img) {
      newRecipe.append("img", img);
    } else {
      newRecipe.append("picture", data.picture);
    }

    newRecipe.append("name", data.name);
    newRecipe.append("description", data.description);
    newRecipe.append("ingredients", data.ingredients);
    newRecipe.append("category", data.category);
    newRecipe.append("instructions", data.instructions);
    newRecipe.append("author", user._id);

    let response = await axios.put(`${base}/recipe/${recipeId}`, newRecipe);

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
        <h3>Edit Recipe</h3>
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
              defaultValue={recipe.name}
              onChange={(e) => setValues({ ...values, name: e.target.value })}
            />
          </div>
          <div className="mb-3">
            <input
              type="text"
              className="form-control"
              id="exampleInputEmail1"
              defaultValue={recipe.description}
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
              defaultValue={recipe.ingredients}
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
              defaultValue={recipe.instructions}
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
              defaultValue={recipe.category}
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
          Edit
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
