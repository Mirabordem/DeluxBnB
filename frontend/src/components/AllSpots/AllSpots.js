import React from "react";
import OneSpot from "../OneSpot/OneSpot";
import "./AllSpots.css";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { thunkGetSpots, clearSpot } from "../../store/spots";



function AllSpots() {
  const dispatch = useDispatch();


  const allSpotsObj = useSelector((state) => state.spots.allSpots);
  // console.log("🚀 ~ file: AllSpots.js:16 ~ AllSpots ~ objAllSpots:", objAllSpots)

  const allSpotsArr = Object.values(allSpotsObj);
  // console.log("🚀 ~ file: spots.js:12 ~ Spots ~ arrSpots:", arrSpots)



  useEffect(() => {
    dispatch(thunkGetSpots());
    dispatch(clearSpot());
  }, [dispatch]);



  return (
    <div className="all-spots-container">
      {allSpotsArr.map((spot) => (
        <OneSpot spot={spot} />
      ))}
    </div>
  );
}




export default AllSpots;
