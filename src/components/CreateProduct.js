import axios from "axios";
import { useState } from "react";

const CreateProduct = () => {
  const [form, setForm] = useState({
    productName: "",
    storeName: "",
    warranty: "",
    contactNumber: "",
    extraDetails: ""
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post("http://localhost:5000/api/v1/product/create", form);

      console.log("Product Created:", res.data.product);

      alert("Product Created Successfully!");

    } catch (err) {
      console.log(err);
      alert("Error Creating Product");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input name="productName" placeholder="Product Name" onChange={handleChange} />
      <input name="storeName" placeholder="Store Name" onChange={handleChange} />
      <input name="warranty" placeholder="Warranty (months)" onChange={handleChange} />
      <input name="contactNumber" placeholder="Contact Number" onChange={handleChange} />
      <input name="extraDetails" placeholder="Extra Details" onChange={handleChange} />
      <button type="submit">Create</button>
    </form>
  );
};

export default CreateProduct;
