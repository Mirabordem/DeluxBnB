import React from "react";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { thunkGetUserSpots } from "../../store/spots";
import OneSpot from "../OneSpot/OneSpot";
import "../AllSpots/AllSpots.css";
import "./ManageSpots.css";

function ManageSpots() {
  const dispatch = useDispatch();
  const history = useHistory();

  const user = useSelector((state) => state.session.user);

  const userSpotsObj = useSelector((state) => state.spots.allSpots);
  const userSpotsArr = Object.values(userSpotsObj);

  let emptyUserSpotsObj = false;

  useEffect(() => {
    dispatch(thunkGetUserSpots());
  }, [dispatch]);


  if (!user) history.push("/");

  if (Object.keys(userSpotsObj).length === 0) {
    emptyUserSpotsObj = true;
  }


  // directing a new spot:
  const spotDirection = () => {
    const path = "/spots/new";
    history.push(path);
  };


  return (
    <div className="main-container">
      <div className="header">
        <h1>Your Places</h1>
        <div className="divider2"></div>
        {emptyUserSpotsObj && (
          <button className="manage-button" onClick={spotDirection}>
            Create a New Spot
          </button>
        )}
      </div>
      <div className="main-container all-spots-container">
        {userSpotsArr.map((spot) => (
          <OneSpot spot={spot} />
        ))}
      </div>
    </div>
  );
}



export default ManageSpots;
