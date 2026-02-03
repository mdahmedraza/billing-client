import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { rproductPublic } from "../../redux/slices/authSlice";
import LoadingScreen from "../../components/LoadingScreen";
import styles from "./ProductPublic.module.css";

const ProductPublic = () => {
  const { id } = useParams();
  const dispatch = useDispatch();

  useEffect(() => {
    if (id) {
      dispatch(rproductPublic(id));
    }
  }, [dispatch, id]);

  const productState = useSelector(
    (state) => state.AuthSlice.data.rproductPublic
  );

  const isLoading = productState?.isLoading;
  const product = productState?.data?.product || productState?.product;

  // ---------------- WARRANTY HELPERS ----------------

  const getWarrantyExpiryDate = (createdAt, warrantyMonths) => {
    if (!createdAt || !warrantyMonths) return "-";

    const expiryDate = new Date(createdAt);
    expiryDate.setMonth(expiryDate.getMonth() + Number(warrantyMonths));

    return expiryDate.toLocaleDateString();
  };

  const isWarrantyExpired = (createdAt, warrantyMonths) => {
    if (!createdAt || !warrantyMonths) return false;

    const expiryDate = new Date(createdAt);
    expiryDate.setMonth(expiryDate.getMonth() + Number(warrantyMonths));

    return new Date() > expiryDate;
  };

  if (isLoading || !product) {
    return <LoadingScreen />;
  }

  const warrantyExpired = isWarrantyExpired(
    product.createdAt,
    product.warranty
  );

  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <h1 className={styles.title}>Product Warranty Card</h1>

        {/* WARRANTY STATUS */}
        {warrantyExpired ? (
          <div className={styles.expiredBadge}>❌ Warranty Expired</div>
        ) : (
          <div className={styles.activeBadge}>✅ Under Warranty</div>
        )}

        <div className={styles.infoGrid}>
          <div className={styles.infoBlock}>
            <span className={styles.label}>Product</span>
            <span className={styles.value}>{product.productName}</span>
          </div>

          <div className={styles.infoBlock}>
            <span className={styles.label}>Store</span>
            <span className={styles.value}>{product.storeName}</span>
          </div>

          <div className={styles.infoBlock}>
            <span className={styles.label}>Warranty</span>
            <span className={styles.value}>{product.warranty} months</span>
          </div>

          <div className={styles.infoBlock}>
            <span className={styles.label}>Purchase Date</span>
            <span className={styles.value}>
              {product.createdAt
                ? new Date(product.createdAt).toLocaleDateString()
                : "-"}
            </span>
          </div>

          <div className={styles.infoBlock}>
            <span className={styles.label}>Warranty Expiry</span>
            <span className={styles.value}>
              {getWarrantyExpiryDate(
                product.createdAt,
                product.warranty
              )}
            </span>
          </div>

          <div className={styles.infoBlockWide}>
            <span className={styles.label}>Product ID</span>
            <span className={styles.valueMono}>{product.productId}</span>
          </div>
        </div>

        <div className={styles.codeCard}>
          {product.barcodeImage && (
            <img
              src={product.barcodeImage}
              alt="Barcode"
              className={styles.barcodeImg}
            />
          )}

          {product.qrCode && (
            <img
              src={product.qrCode}
              alt="QR Code"
              className={styles.qrImg}
            />
          )}
        </div>

        <p className={styles.helperText}>
          Show this code at the store to verify your product and warranty.
        </p>
      </div>
    </div>
  );
};

export default ProductPublic;






// import React, { useEffect } from "react";
// import { useParams } from "react-router-dom";
// import { useDispatch, useSelector } from "react-redux";
// import { rproductPublic } from "../../redux/slices/authSlice"; // <- your new thunk
// import LoadingScreen from "../../components/LoadingScreen";

// const ProductPublic = () => {
//   const { id } = useParams();
//   const dispatch = useDispatch();

//   useEffect(() => {
//     if (id) {
//       dispatch(rproductPublic(id));
//     }
//   }, [dispatch, id]);

//   // adjust path to match how you store it in the slice
//   const productState = useSelector(
//     (state) => state.AuthSlice.data.rproductPublic
//   );

//   const isLoading = productState?.isLoading;
//   const product = productState?.data?.product || productState?.product;

//   if (isLoading || !product) {
//     return <LoadingScreen />;
//   }

//   console.log("the product....", product);

//   return (
//     <div style={{ padding: "20px" }}>
//       <div>
//         <h3>Product Details:</h3>
//         <p>
//           <b>Name:</b> {product.productName}
//         </p>
//         <p>
//           <b>Store:</b> {product.storeName}
//         </p>
//         <p>
//           <b>Warranty:</b> {product.warranty} months
//         </p>
//         <p>
//           <b>Date:</b>{" "}
//           {product.defaultDate
//             ? new Date(product.defaultDate).toLocaleString()
//             : "-"}
//         </p>
//         <p>
//           <b>Product ID:</b> {product.productId}
//         </p>

//         <h4>Barcode:</h4>
//         <img
//           src={product.barcodeImage}
//           alt="barcode"
//           style={{ width: "200px" }}
//         />
//         <h4>QR Code:</h4>
//         <img
//           src={product.qrCode}
//           alt="qr-code"
//           style={{ width: "200px" }}
//         />
//       </div>
//     </div>
//   );
// };

// export default ProductPublic;





// import React, { useEffect, useState } from "react";
// import { useParams } from "react-router-dom";
// import axios from "axios";

// const ProductPublicPage = () => {
//   const { id } = useParams();
//   const [product, setProduct] = useState(null);

//   useEffect(() => {
//     const fetchProduct = async () => {
//       try {
//         const res = await axios.get(
//           `http://localhost:5000/api/v1/product/all/${id}`
//         );
//         setProduct(res.data.product);
//       } catch (error) {
//         console.log(error);
//       }
//     };

//     fetchProduct();
//   }, [id]);

//   if (!product) return <p>Loading...</p>;
//   console.log("the product....", product);

//   return (
//     <div style={{ padding: "20px" }}>
//       {product && (
//         <div>
//           <h3>Product Details:</h3>
//           <p><b>Name:</b> {product.productName}</p>
//           <p><b>Store:</b> {product.storeName}</p>
//           <p><b>Warranty:</b> {product.warranty} months</p>
//           <p><b>Date:</b> {new Date(product.defaultDate).toLocaleString()}</p>
//           <p><b>Product ID:</b> {product.productId}</p>

//           <h4>Barcode:</h4>
//           <img src={product.barcodeImage} alt="barcode" style={{ width: "200px" }} />
//           <h4>QR Code:</h4>
//           <img src={product.qrCode} alt="qr-code" style={{ width: "200px" }} /> 
//         </div>
//       )}
//     </div>
//   );
// };

// export default ProductPublicPage;
