import axios from "axios";
import { useState } from "react";

const GetProduct = () => {
  const [productId, setProductId] = useState("");
  const [data, setData] = useState(null);

  const fetchProduct = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/api/v1/product/all/${productId}`);
      setData(res.data.product);
    } catch (err) {
      console.log(err);
      alert("Product not found!");
    }
  };

  return (
    <div>
      <input
        placeholder="Enter productId"
        value={productId}
        onChange={(e) => setProductId(e.target.value)}
      />
      <button onClick={fetchProduct}>Get Product</button>

      {data && (
        <div>
          <h3>Product Details:</h3>
          <p><b>Name:</b> {data.productName}</p>
          <p><b>Store:</b> {data.storeName}</p>
          <p><b>Warranty:</b> {data.warranty} months</p>
          <p><b>Date:</b> {new Date(data.defaultDate).toLocaleString()}</p>
          <p><b>Product ID:</b> {data.productId}</p>

          <h4>Barcode:</h4>
          <img src={data.barcodeImage} alt="barcode" style={{ width: "200px" }} />
          <h4>QR Code:</h4>
          <img src={data.qrCode} alt="qr-code" style={{ width: "200px" }} /> 
        </div>
      )}
    </div>
  );
};

export default GetProduct;
