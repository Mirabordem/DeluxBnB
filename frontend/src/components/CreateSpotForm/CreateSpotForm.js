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
  const [urlFour, setUrlFour] = setState("");

  const [errors, setErrors] = setState({});

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
    country,
    address,
    city,
    state,
    description,
    name,
    price,
    preview,
    urlOne,
    urlTwo,
    urlThree,
    urlFour
  ) {

    const errorsObj = {};

    if (country.length < 2) errorsObj['country'] = 'Country is required.';
    if (address.length < 5) errorsObj['address'] = 'Address is required.';
    if (city.length < 2) errorsObj['city'] = 'City name is required.';
    if (state.length < 2) errorsObj['state'] = 'State is required.';
    if (description.length < 30) errorsObj['description'] = 'Description needs a minimum of 30 characters.';
    if (name.length < 1) errorsObj['name'] = 'Name is required.';
    if (price <= 0) errorsObj['price'] = 'Price is required.';
    if (preview.length < 1) errorsObj['preview'] = 'Preview image is required.';
    if (!(preview.toLowerCase().endsWith('.png'))
    || !(preview.toLowerCase().endsWith('.jpg'))
    || !(preview.toLowerCase().endsWith('.jpeg'))
    ) {errorsObj['endPreview'] = 'Preview image URL must end in .png, .jpg, or .jpeg'}
    if (urlOne) {
        if (!(urlOne.toLowerCase().endsWith('.png'))
        || !(urlOne.toLowerCase().endsWith('.jpg'))
        || !(urlOne.toLowerCase().endsWith('.jpeg'))
        ) {errors['urlOne'] = 'Image URL must end in .png, .jpg, or .jpeg'}
    }
    if (urlTwo) {
        if (!(urlTwo.toLowerCase().endsWith('.png'))
        || !(urlTwo.toLowerCase().endsWith('.jpg'))
        || !(urlTwo.toLowerCase().endsWith('.jpeg'))
        ) {errors['urlTwo'] = 'Image URL must end in .png, .jpg, or .jpeg'}
    }
    if (urlThree) {
        if (!(urlThree.toLowerCase().endsWith('.png'))
        || !(urlThree.toLowerCase().endsWith('.jpg'))
        || !(urlThree.toLowerCase().endsWith('.jpeg'))
        ) {errors['urlThree'] = 'Image URL must end in .png, .jpg, or .jpeg'}
    }
    if (urlFour) {
        if (!(urlFour.toLowerCase().endsWith('.png'))
        || !(urlFour.toLowerCase().endsWith('.jpg'))
        || !(urlFour.toLowerCase().endsWith('.jpeg'))
        ) {errors['urlFour'] = 'Image URL must end in .png, .jpg, or .jpeg'}
    }
    return errorsObj;
  };


  const handleSubmit = async (e) => {
    e.preventDefault();

    const newErrors = checkErrors(
      country,
      address,
      city,
      state,
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
        return null;
    }


    const payload = {
        country,
        address,
        city,
        state,
        name,
        description,
        price
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
  <div></div>


  );
}





export default CreateSpotForm;
