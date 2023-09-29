import React from "react";
import { useParams, useHistory } from "react-router-dom";
import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { thunkGetDetails, thunkUpdateSpot } from "../../store/spots";

function UpdateSpotForm() {
  const dispatch = useDispatch();
  const history = useHistory();

  const { spotId } = useParams();


  const [country, setCountry] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [description, setDescription] = useState("");
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");

  const [errors, setErrors] = useState({});


  useEffect(() => {
    dispatch(thunkGetDetails(spotId)).then((res) => {
      setCountry(res.country);
      setAddress(res.address);
      setCity(res.city);
      setState(res.state);
      setDescription(res.description);
      setName(res.name);
      setPrice(res.price);
    });
  }, [dispatch, spotId]);


  const updateCountry = (e) => setCountry(e.target.value);
  const updateAddress = (e) => setAddress(e.target.value);
  const updateCity = (e) => setCity(e.target.value);
  const updateState = (e) => setState(e.target.value);
  const updateDescription = (e) => setDescription(e.target.value);
  const updateName = (e) => setName(e.target.value);
  const updatePrice = (e) => setPrice(e.target.value);
  

  function checkErrors(
    address,
    city,
    state,
    country,
    name,
    description,
    price
    // preview
  ) {
    const errorsObj = {};

    if (address.length < 5) errorsObj["address"] = "Address is required.";
    if (city.length < 2) errorsObj["city"] = "City name is required.";
    if (state.length < 2) errorsObj["state"] = "State is required.";
    if (country.length < 2) errorsObj["country"] = "Country is required.";
    if (name.length < 1) errorsObj["name"] = "Name is required.";
    if (description.length < 30)
      errorsObj["description"] =
        "Description needs a minimum of 30 characters.";
    if (description.length > 280)
      errorsObj["description"] = "Description cannot exceed 280 characters.";
    if (price <= 0) errorsObj["price"] = "Price is required.";
    if (price >= 999999) errorsObj["maxPrice"] = "Price cannot exceed $999999";


    return errorsObj;
  }

  const lat = 20;
  const lng = 20;

  const handleUpdate = async (e) => {
    e.preventDefault();

    const newErrors = checkErrors(
      address,
      city,
      state,
      country,
      name,
      description,
      price
    );

    setErrors(newErrors);
    if (Object.values(newErrors).length > 0) {
      return null;
    }

    const payload = {
      address,
      city,
      state,
      country,
      lat,
      lng,
      name,
      description,
      price,
    };

    let newSpot = await dispatch(thunkUpdateSpot(spotId, payload));
    dispatch(thunkGetDetails(newSpot.id));
    history.push(`/spots/${newSpot.id}`);
  };

  return (
    <div className="form-main-container">
      <h1 className="h1">Update Your Spot</h1>
      <h2 className="header2">Where's your place located?</h2>
      <div className="header3">
        Guests will only get your exact address once they booked a reservation.
      </div>

      <form onSubmit={handleUpdate}>
        <div className="errors-container">
          <label>Country</label>
          {errors.country && <p className="errors">{errors.country}</p>}
        </div>

        <input
          type="text"
          name="Country"
          value={country}
          onChange={updateCountry}
          placeholder="Country"
        />

        <div className="errors-container">
          <label>Street Address</label>
          {errors.address && <p className="address errors">{errors.address}</p>}
        </div>

        <input
          type="text"
          name="Address"
          value={address}
          onChange={updateAddress}
          placeholder="Address"
        />

        <div className="city-state-container">
          <div className="city city-form">
            <div className="error-container">
              <label>City</label>
              {errors.city && <p className="city-name errors">{errors.city}</p>}
            </div>

            <input
              type="text"
              name="City"
              value={city}
              onChange={updateCity}
              placeholder="City"
            />
          </div>

          <div className="city">
            <div className="errors-container">
              <label>State</label>
              {errors.state && <p className="state errors">{errors.state}</p>}
            </div>

            <input
              type="text"
              name="State"
              value={state}
              onChange={updateState}
              placeholder="STATE"
            />
          </div>
        </div>

        <div className="line"></div>

        <h2 className="header2">Describe your place to guests</h2>
        <div className="header3">
          Mention the best features of your space, any special amenities like
          fast wifi or parking, and what you love about the neighborhood.
        </div>
        {errors.description && (
          <p className="errors description">{errors.description}</p>
        )}

        <textarea
          className="text-area"
          value={description}
          onChange={updateDescription}
          placeholder="Please write at least 30 characters"
        />

        <div className="line"></div>

        <h2 className="header2">Create a title for your spot</h2>
        <div className="header3">
          Catch guests' attention with a spot title that highlights what makes
          your place special.
        </div>
        {errors.name && <p className="errors name">{errors.name}</p>}

        <input
          className="input-name"
          type="text"
          name="Name"
          value={name}
          onChange={updateName}
          placeholder="Name of your spot"
        />

        <div className="form-line"></div>

        <label className="header2">Set a base price for your spot</label>
        <p className="header3">
          Competitive pricing can help your listing stand out and rank higher in
          search results.
        </p>
        <div className="price-container">
          <i class="fa-solid fa-dollar-sign"></i>
          <input
            className="price-form"
            type="number"
            name="price"
            value={price}
            onChange={updatePrice}
            placeholder="Price per night (USD)"
          />
          {errors.price && <p className="form-errors price">{errors.price}</p>}
          {errors.maxPrice && (
            <p className="form-errors price">{errors.maxPrice}</p>
          )}
        </div>

        <div className="line"></div>

        <button className="submit-button" type="submit">
          Update your Spot
        </button>

      </form>
    </div>
  );
}

export default UpdateSpotForm;
