import React from "react";
import OneSpot from "../OneSpot/OneSpot";
import "./AllSpots.css";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { thunkGetSpots, clearSpot } from "../../store/spots";

function AllSpots() {
  const dispatch = useDispatch();

  const objAllSpots = useSelector((state) => state.spots.allSpots);
  const arrAllSpots = Object.values(objAllSpots);
  // console.log("🚀 ~ file: spots.js:12 ~ Spots ~ arrSpots:", arrSpots)

  useEffect(() => {
    dispatch(thunkGetSpots());
    dispatch(clearSpot());
  }, [dispatch]);

  return (
    <div className="all-spots-container">
      {arrAllSpots.map((spot) => (
        <OneSpot spot={spot} />
      ))}
    </div>
  );
}

export default AllSpots;

