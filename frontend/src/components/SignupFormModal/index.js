import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { useModal } from "../../context/Modal";
import * as sessionActions from "../../store/session";
import "./SignupForm.css";

function SignupFormModal() {
  const dispatch = useDispatch();
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState({});
  const { closeModal } = useModal();
  const [disable, setDisable] = useState(false);

  useEffect(() => {
    if (
      username.length < 4 ||
      password < 6 ||
      !email ||
      !firstName ||
      !lastName
    ) {
      setDisable(true);
    } else {
      setDisable(false);
    }
  }, [username, password, email, firstName, lastName, disable]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (password === confirmPassword) {
      setErrors({});
      return dispatch(
        sessionActions.signup({
          email,
          username,
          firstName,
          lastName,
          password,
        })
      )
        .then(closeModal)
        .catch(async (res) => {
          const data = await res.json();
          if (data && data.errors) {
            setErrors(data.errors);
          }
        });
    }
    return setErrors({
      confirmPassword:
        "Confirm Password field must be the same as the Password field",
    });
  };

  return (
    <div className="sign-up-container">
      <h1>Sign Up</h1>
      <form onSubmit={handleSubmit}>
        <div className="signup-container">
          <label className="input-container">First Name</label>
        </div>
        <input
          type="text"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          required
        />
        {errors.firstName && <p className="error">{errors.firstName}</p>}

        <div className="signup-container">
          <label className="input-container">Last Name</label>
        </div>
        <input
          type="text"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
          required
        />
        {errors.lastName && <p className="error">{errors.lastName}</p>}

        <div className="signup-container">
          <label className="input-container">Email</label>
        </div>
        <input
          type="text"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        {errors.email && <p className="error">{errors.email}</p>}

        <div className="signup-container">
          <label className="input-container">Username</label>
        </div>
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        {errors.username && <p className="error">{errors.username}</p>}

        <div className="signup-container">
          <label className="input-container">Password</label>
        </div>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        {errors.password && <p className="error">{errors.password}</p>}

        <div className="signup-container">
          <label className="input-container">Confirm Password</label>
        </div>
        <input
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
        />
        {errors.confirmPassword && (
          <p className="error">{errors.confirmPassword}</p>
        )}
        <button
          className="sign-up-submit-button"
          type="submit"
          disabled={disable}
        >
          Sign Up
        </button>
      </form>
    </div>
  );
}

export default SignupFormModal;
