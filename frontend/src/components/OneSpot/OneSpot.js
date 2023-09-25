import React from "react";
import { NavLink } from "react-router-dom";
import "./OneSpot.css";
import "react-tooltip/dist/react-tooltip.css";
import Tooltip from "../Tooltip/Tooltip";
import DeleteModal from "../DeleteModal/DeleteModal";
import OpenModalMenuItem from "../Navigation/OpenModalMenuItem";

function OneSpot({ spot }) {
  let manage = false;
  if (window.location.href.endsWith("current")) {
    manage = true;
  }

  return (
    <div className="spot-container">
      <div className="spot-image-container">
        <Tooltip content={spot.name} direction="top">
          <NavLink>
            <img
              className="one-spot-image"
              src={spot.previewImage}
              content={spot.name}
              alt=""
            />
          </NavLink>
        </Tooltip>
      </div>
      <NavLink
        to={"/spots/${spot.id"}
        style={{ textDecoration: "none", color: "black" }}
      >
        <div className="one-spot-info">
          <div>
            <h4 className="one-spot-location">
              {spot.city}, {spot.state}
            </h4>
            <p className="one-spot-price">${spot.price} night</p>
          </div>
          <div className="star-rating">
            {spot.avgRating >= 1 ? (
              <div className="star-rating-container">
                <i className="fa-solid fa-star fa-reviewstar"></i>
                <p>{spot.avgRating.toFixed(2)}</p>
              </div>
            ) : (
              <div className="star-rating-container">
                <i className="fa-regular fa-star fa-reviewstar"></i>
                <p className="one-spot-new">New</p>
              </div>
            )}
          </div>
        </div>
      </NavLink>
      {manage && (
        <div className="update-delete">
          <NavLink to={`/spots/${spot.id}/edit`}>
            <button className="managing-update">Update</button>
          </NavLink>
          <OpenModalMenuItem
            modalComponent={<DeleteModal spot={spot} />}
            itemText="Delete"
          />
        </div>
      )}
    </div>
  );
}

export default OneSpot;
