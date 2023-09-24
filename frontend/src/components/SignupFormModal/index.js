import React, { useState } from "react";
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

      {errors.firstName && <p className="sign-up-errors">{errors.firstName}</p>}
      {errors.lastName && <p className="sign-up-errors">{errors.lastName}</p>}
      {errors.username && <p className="sign-up-errors">{errors.username}</p>}
      {errors.confirmPassword && (
        <p className="sign-up-errors">{errors.confirmPassword}</p>
      )}

      <form onSubmit={handleSubmit} className='form'>
        <div className="signup-container">
          <label className="input-container">First Name</label>
        </div>
        <input
          type="text"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          required
        />
        <div className="signup-container">
          <label className="input-container">Last Name </label>
        </div>
        <input
          type="text"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
          required
        />
        <div className="signup-container">
          <label className="input-container">Email: </label>
        </div>
        <input
          type="text"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <div className="signup-container">
          <label className="input-container">Username:</label>
        </div>
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        <div className="signup-container">
          <label className="input-container">Password:</label>
        </div>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <div className="signup-container">
          <label className="input-container">Confirm Password: </label>
        </div>
        <input
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
        />
        <button
          className="submit-button"
          type="submit"
          disabled={
            firstName.length < 2 ||
            lastName.length < 2 ||
            email.length < 1 ||
            username.length < 4 ||
            password.length < 6 ||
            confirmPassword.length < password.length
          }
        >
          Sign Up
        </button>
      </form>
    </div>
  );
}

export default SignupFormModal;
