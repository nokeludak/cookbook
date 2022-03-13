import React, { useState, useEffect } from "react";
import base from "../../config";
import axios from "axios";
import { Button } from "react-bootstrap";
import { list } from "../../services/recipe-api";

export default function Home() {
  const [recipes, setRecipes] = useState([]);
  const [topRatings, setTopRatings] = useState([]);
  const [latest, setLatest] = useState([]);
  const [search, setSearch] = useState("");
  const [searchedRecipes, setSearchedRecipes] = useState([]);

  useEffect(async () => {
    let response = await axios.get(`${base}/recipe`);
    let newData = response.data;

    newData.map((v, i) => {
      if (v.rating.length < 3) {
        v.rating = 0;
      } else {
        let tempAvg = 0;
        v.rating.map((r, j) => {
          tempAvg += r;
        });
        tempAvg /= v.rating.length;
        v.rating = parseFloat(tempAvg.toFixed(2));
      }
    });

    setRecipes(newData);
    setSearchedRecipes(newData);
    let last = newData[newData.length - 1];
    let last2 = newData[newData.length - 2];
    let last3 = newData[newData.length - 3];
    setLatest([last, last2, last3]);
  }, []);

  useEffect(() => {
    if (recipes.length === 0) return;

    axios.get(`${base}/recipe`).then((response) => {
      let newData = response.data;

      newData.map((v, i) => {
        if (v.rating.length < 3) {
          v.rating = 0;
        } else {
          let tempAvg = 0;
          v.rating.map((r, j) => {
            tempAvg += r;
          });
          tempAvg /= v.rating.length;
          v.rating = parseFloat(tempAvg.toFixed(2));
        }
      });

      let tempRatings = newData.sort((a, b) =>
        b.rating > a.rating ? 1 : a.rating > b.rating ? -1 : 0
      );
      setTopRatings(tempRatings);
    });
  }, [recipes]);

  const searchForRecipes = () => {
    if (search === "") {
      setSearchedRecipes(recipes);
    } else {
      let temp = recipes;
      let newReciepe = [];
      for (let i = 0; i < temp.length; i++) {
        if (temp[i].name === search) {
          newReciepe.push(temp[i]);
        }
      }

      setSearchedRecipes(newReciepe);
    }
  };

  return (
    <div className="home">
      <div className="home-left">
        <div className="mb-3">
          <input
            type="text"
            className="form-control"
            id="exampleInputEmail1"
            placeholder="search..."
            onChange={(e) => setSearch(e.target.value)}
          />
          <Button variant="outline-dark" onClick={searchForRecipes}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              fill="currentColor"
              className="bi bi-search"
              viewBox="0 0 16 16"
            >
              <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z" />
            </svg>
          </Button>
        </div>

        {searchedRecipes &&
          searchedRecipes.map((v, i) => {
            return (
              <div
                className="single-search"
                key={i}
                onClick={() => window.location.assign(`/recipe/${v._id}`)}
              >
                <div className="single-top">
                  <p className="single-name">{v.name}</p>
                  <p className="single-rating">{v.rating}</p>
                </div>

                <div className="single-bottom">
                  <p className="single-ingredients">{v.ingredients}</p>
                  <p className="single-category">{v.category}</p>
                </div>
              </div>
            );
          })}
      </div>

      <div className="home-right">
        <div className="home-right-top">
          <div className="home-right-top-title">
            <h2>Top Ratings</h2>
          </div>
          {topRatings &&
            topRatings.map((v, i) => {
              return (
                <div
                  className="top-single"
                  key={i}
                  onClick={() => window.location.assign(`/recipe/${v._id}`)}
                >
                  <p>{v.name}</p>
                  <p>{v.rating}</p>
                </div>
              );
            })}

          {topRatings.length === 0 && (
            <p className="top-single">No Recipes Rated Yet!</p>
          )}
        </div>

        <div className="home-right-bottom">
          <div className="home-right-bottom-title">
            <h2>Latest</h2>
          </div>
          {latest &&
            latest.map((v, i) => {
              return (
                <div
                  className="latest-single"
                  key={i}
                  onClick={() => window.location.assign(`/recipe/${v._id}`)}
                >
                  
                </div>
              );
            })}
        </div>
      </div>
    </div>
  );
}
