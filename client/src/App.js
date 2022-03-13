import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./components/core/Home";
import Signin from "./components/modals/Signin";
import Create from "./components/modals/Create";
import Header from "./components/core/Header";
import SingleRecipe from "./components/SingleRecipe";
import AddRecipe from "./components/AddRecipe";
import MyRecipes from "./components/MyRecipes";
import EditRecipe from "./components/EditRecipe";
import MyProfile from "./components/MyProfile";
import EditProfile from "./components/EditProfile";

export default function App() {
  const [login, setLogin] = useState(true);
  const [create, setCreate] = useState(false);

  return (
    <div className="app">
      <BrowserRouter>
        <Header login={login} />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/recipe/:recipeId" element={<SingleRecipe />} />
          <Route path="/add" element={<AddRecipe />} />
          <Route path="/myrecipes" element={<MyRecipes />} />
          <Route path="/myrecipe/edit/:recipeId" element={<EditRecipe />} />
          <Route path="/profile" element={<MyProfile />} />
          <Route path="/profile/edit" element={<EditProfile />} />
        </Routes>
      </BrowserRouter>

      {login && (
        <Signin setLogin={setLogin} login={login} setCreate={setCreate} />
      )}

      {create && (
        <Create setCreate={setCreate} create={create} setLogin={setLogin} />
      )}
    </div>
  );
}
