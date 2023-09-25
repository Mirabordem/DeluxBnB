import React, { useState, useEffect, useRef } from "react";
import { useDispatch } from "react-redux";
import { NavLink } from "react-router-dom";
import { useHistory } from "react-router-dom";
import * as sessionActions from "../../store/session";
import OpenModalMenuItem from "./OpenModalMenuItem";
import LoginFormModal from "../LoginFormModal";
import SignupFormModal from "../SignupFormModal";

function ProfileButton({ user }) {
  const dispatch = useDispatch();
  const [showMenu, setShowMenu] = useState(false);
  const ulRef = useRef();
  const history = useHistory();

  const openMenu = () => {
    if (showMenu) return;
    setShowMenu(true);
  };

  useEffect(() => {
    if (!showMenu) return;

    const closeMenu = (e) => {
      if (!ulRef.current.contains(e.target)) {
        setShowMenu(false);
      }
    };

    document.addEventListener("click", closeMenu);

    return () => document.removeEventListener("click", closeMenu);
  }, [showMenu]);

  const closeMenu = () => setShowMenu(false);

  const logout = (e) => {
    e.preventDefault();
    dispatch(sessionActions.logout());
    closeMenu();
    history.push("/");
  };

  const textDiv = "profile-dropdown" + (showMenu ? "" : " hidden");
  const userDiv = "profile-dropdown" + (user ? "-loggedin" : "-loggedout");

  return (
    <div>
      <button className="profile-button" onClick={openMenu}>
        <i className="fa-solid fa-bars" />
        <i className="fas fa-user-circle" />
      </button>
      <div id={userDiv} className={textDiv} ref={ulRef}>
        {user ? (
          <div className="dropdown">
            <p className="text">
              Hello, <strong>{user.firstName}!</strong>
            </p>
            <p className="email"> {user.email}</p>
            <div className="line"></div>
            <NavLink
              style={{ color: "black", textDecoration: "none" }}
              onClick={closeMenu}
              to="/spots/current"
            >
              <div className="link">
                <p className="house">⌂</p> Manage Spots
              </div>
            </NavLink>
            <div className="line"></div>
            <button className="logout-button" onClick={logout}>
              Log Out
            </button>
          </div>
        ) : (
          <div>
            <OpenModalMenuItem
              itemText="Log In"
              onItemClick={closeMenu}
              modalComponent={<LoginFormModal />}
            />
            <OpenModalMenuItem
              itemText="Sign Up"
              onItemClick={closeMenu}
              modalComponent={<SignupFormModal />}
            />
          </div>
        )}
      </div>
    </div>
  );
}

export default ProfileButton;
