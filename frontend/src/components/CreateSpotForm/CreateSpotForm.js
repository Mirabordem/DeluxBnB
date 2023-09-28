import React from "react";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import "./CreateSpotForm.css";
import {
  thunkGetDetails,
  thunkCreateNewSpot,
  thunkCreateImageForSpot,
} from "../../store/spots";

function CreateSpotForm() {
  const dispatch = useDispatch();
  const history = useHistory();

  const [country, setCountry] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [description, setDescription] = useState("");
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [preview, setPreview] = useState("");
  const [urlOne, setUrlOne] = useState("");
  const [urlTwo, setUrlTwo] = useState("");
  const [urlThree, setUrlThree] = useState("");
  const [urlFour, setUrlFour] = useState("");

  const [errors, setErrors] = useState({});

  const updateCountry = (e) => setCountry(e.target.value);
  const updateAddress = (e) => setAddress(e.target.value);
  const updateCity = (e) => setCity(e.target.value);
  const updateState = (e) => setState(e.target.value);
  const updateDescription = (e) => setDescription(e.target.value);
  const updateName = (e) => setName(e.target.value);
  const updatePrice = (e) => setPrice(e.target.value);
  const updatePreview = (e) => setPreview(e.target.value);
  const updateUrlOne = (e) => setUrlOne(e.target.value);
  const updateUrlTwo = (e) => setUrlTwo(e.target.value);
  const updateUrlThree = (e) => setUrlThree(e.target.value);
  const updateUrlFour = (e) => setUrlFour(e.target.value);

  function checkErrors(
    address,
    city,
    state,
    country,
    name,
    description,
    price,
    preview,
    urlOne,
    urlTwo,
    urlThree,
    urlFour
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
    if (description.length > 400)
      errorsObj["description"] = "Description cannot exceed 400 characters.";
    if (price <= 0) errorsObj["price"] = "Price is required.";
    if (price >= 999999) errorsObj['maxPrice'] = 'Price cannot exceed $999999';
    if (preview.length < 1) errorsObj["preview"] = "Preview image is required.";

  if(
    preview.toLowerCase().endsWith(".png") ||
    preview.toLowerCase().endsWith(".jpeg") ||
    preview.toLowerCase().endsWith(".jpg")
  ) {

  } else {
    errorsObj["endPreview"] = 'Preview image URL must end in .png, .jpg, or .jpeg'
  }
  if (urlOne) {
    if (
      urlOne.toLowerCase().endsWith(".png") ||
      urlOne.toLowerCase().endsWith(".jpeg") ||
      urlOne.toLowerCase().endsWith(".jpg")
    ) {
    } else {
      errorsObj["urlOne"] = "Image URL must end in .png, .jpg, or .jpeg";
    }
  }
  if (urlTwo) {
    if (
      urlTwo.toLowerCase().endsWith(".png") ||
      urlTwo.toLowerCase().endsWith(".jpeg") ||
      urlTwo.toLowerCase().endsWith(".jpg")
    ) {
    } else {
      errorsObj["urlTwo"] = "Image URL must end in .png, .jpg, or .jpeg";
    }
  }
  if (urlThree) {
    if (
      urlThree.toLowerCase().endsWith(".png") ||
      urlThree.toLowerCase().endsWith(".jpeg") ||
      urlThree.toLowerCase().endsWith(".jpg")
    ) {
    } else {
      errorsObj["urlThree"] = "Image URL must end in .png, .jpg, or .jpeg";
    }
  }
  if (urlFour) {
    if (
      urlFour.toLowerCase().endsWith(".png") ||
      urlFour.toLowerCase().endsWith(".jpeg") ||
      urlFour.toLowerCase().endsWith(".jpg")
    ) {
    } else {
      errorsObj["urlFour"] = "Image URL must end in .png, .jpg, or .jpeg";
    }
  }

  return errorsObj;
}


  const lat = 20;
  const lng = 20;

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newErrors = checkErrors(
        address,
        city,
        state,
        country,
        name,
        description,
        price,
        preview,
        urlOne,
        urlTwo,
        urlThree,
        urlFour
    );

    setErrors(newErrors);
    if (Object.values(newErrors).length > 0) {
      console.log('message: enter if statement', errors)
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

    const newSpot = await dispatch(thunkCreateNewSpot(payload));

    await dispatch(thunkCreateImageForSpot(newSpot.id, preview, true));
    await dispatch(thunkCreateImageForSpot(newSpot.id, urlOne, false));
    await dispatch(thunkCreateImageForSpot(newSpot.id, urlTwo, false));
    await dispatch(thunkCreateImageForSpot(newSpot.id, urlThree, false));
    await dispatch(thunkCreateImageForSpot(newSpot.id, urlFour, false));

    if (newSpot) {
      dispatch(thunkGetDetails(newSpot.id));
      history.push(`/spots/${newSpot.id}`);
    }
  };

  return (
    <div className="form-main-container">
      <h1 className="h1">Create a New Spot</h1>
      <h2 className="header2">Where's your place located?</h2>
      <div className="header3">
        Guests will only get your exact address once they booked a reservation.
      </div>

      <form onSubmit={handleSubmit}>
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

        <div className="line"></div>

        <h2 className="header2">Set a base price for your spot</h2>
        <div className="header3">
          Competitive pricing can help your listing stand out and rank higher in
          search results.
        </div>
        <div className="price-container">
          <i className="fa-solid fa-dollar-sign"></i>
          <input
            className="price-form"
            type="number"
            name="Price"
            value={price}
            onChange={updatePrice}
            placeholder="Price per night (USD)"
          />
          {errors.price && <p className="errors price">{errors.price}</p>}
          {errors.maxPrice && <p className="errors price">{errors.maxPrice}</p>}
        </div>

        <div className="line"></div>

        <h2 className="header2">Liven up your spot with photos</h2>
        <div className="header3">
          Submit a link to at least one photo to publish your spot.
        </div>
        <div className="url-container">
          {/* {errors.preview} && <p className="errors preview">{errors.preview}</p> */}
          {errors.preview && <p className="errors preview">{errors.preview}</p>}
          {errors.endPreview && (
            <p className="errors preview">{errors.endPreview}</p>
          )}
          <input
            className="preview-url"
            type="url"
            name="PreviewUrl"
            value={preview}
            onChange={updatePreview}
            placeholder="Preview image URL"
          />
          {errors.urlOne && <p className="errors url">{errors.urlOne}</p>}
          <input
            className="form-url"
            type="url"
            name="imageUrl"
            value={urlOne}
            onChange={updateUrlOne}
            placeholder="Image URL"
          />
          {errors.urlTwo && <p className="errors url">{errors.urlTwo}</p>}
          <input
            className="form-url"
            type="url"
            name="imageUrl"
            value={urlTwo}
            onChange={updateUrlTwo}
            placeholder="Image URL"
          />
          {errors.urlThree && <p className="errors url">{errors.urlThree}</p>}
          <input
            className="form-url"
            type="url"
            name="imageUrl"
            value={urlThree}
            onChange={updateUrlThree}
            placeholder="Image URL"
          />
          {errors.urlFour && <p className="errors url">{errors.urlFour}</p>}
          <input
            className="form-url"
            type="url"
            name="imageUrl"
            value={urlFour}
            onChange={updateUrlFour}
            placeholder="Image URL"
          />
        </div>

        <div className="line"></div>

        <button className="submit-button" type="submit">
          Create Spot
        </button>
      </form>
    </div>
  );
}

export default CreateSpotForm;
