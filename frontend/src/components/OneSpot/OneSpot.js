import React from "react";
import { NavLink } from "react-router-dom";
import "./OneSpot.css";
import "react-tooltip/dist/react-tooltip.css";
import Tooltip from "../Tooltip/Tooltip";
import DeleteModal from "../DeleteModal/DeleteModal";
import OpenModalMenuItem from "../Navigation/OpenModalMenuItem";



function OneSpot({spot}) {
    let manage = false;
    if (window.location.href.endsWith('current')) {
        manage = true;
    }




}


export default SingleSpot;
