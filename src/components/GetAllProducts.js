import axios from "axios";
import { useEffect, useState } from "react";

const GetAllProducts = () => {
  const [products, setProducts] = useState([]);

  const fetchProducts = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/v1/product");
      setProducts(res.data.products);
    } catch (err) {
      console.log(err);
      alert("Failed to load products");
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  return (
    <div>
      <h2>All Products</h2>

      {products.length === 0 && <p>No products found.</p>}

      {products.map((p) => (
        <div key={p.productId} style={{ border: "1px solid #ccc", padding: "10px", margin: "10px" }}>
          <p><b>Name:</b> {p.productName}</p>
          <p><b>Store:</b> {p.storeName}</p>
          <p><b>Product ID:</b> {p.productId}</p>
          <img src={p.barcodeImage} alt="barcode" style={{ width: "180px" }} />
        </div>
      ))}
    </div>
  );
};

export default GetAllProducts;
