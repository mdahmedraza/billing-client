




import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

const ProductPublicPage = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await axios.get(
          `http://localhost:5000/api/v1/product/all/${id}`
        );
        setProduct(res.data.product);
      } catch (error) {
        console.log(error);
      }
    };

    fetchProduct();
  }, [id]);

  if (!product) return <p>Loading...</p>;
  console.log("the product....", product);

  return (
    <div style={{ padding: "20px" }}>
      {product && (
        <div>
          <h3>Product Details:</h3>
          <p><b>Name:</b> {product.productName}</p>
          <p><b>Store:</b> {product.storeName}</p>
          <p><b>Warranty:</b> {product.warranty} months</p>
          <p><b>Date:</b> {new Date(product.defaultDate).toLocaleString()}</p>
          <p><b>Product ID:</b> {product.productId}</p>

          <h4>Barcode:</h4>
          <img src={product.barcodeImage} alt="barcode" style={{ width: "200px" }} />
          <h4>QR Code:</h4>
          <img src={product.qrCode} alt="qr-code" style={{ width: "200px" }} /> 
        </div>
      )}
    </div>
  );
};

export default ProductPublicPage;
