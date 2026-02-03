



import React, { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { rproductcreate, rproductget, rproductupdate } from "../../redux/slices/authSlice";
import { toast } from "react-hot-toast";
import LoadingScreen from "../../components/LoadingScreen";
import styles from "./Products.module.css";

const Products = () => {
  const dispatch = useDispatch();
  const canvasRef = useRef(null);

  useEffect(() => {
    dispatch(rproductget());
  }, [dispatch]);
  // ---------------- WARRANTY HELPERS ----------------

// const getWarrantyExpiryDate = (createdAt, warrantyMonths) => {
//   if (!createdAt || !warrantyMonths) return "-";

//   const expiryDate = new Date(createdAt);
//   expiryDate.setMonth(expiryDate.getMonth() + Number(warrantyMonths));

//   return expiryDate.toLocaleDateString();
// };

const isWarrantyExpired = (createdAt, warrantyMonths) => {
  if (!createdAt || !warrantyMonths) return false;

  const expiryDate = new Date(createdAt);
  expiryDate.setMonth(expiryDate.getMonth() + Number(warrantyMonths));

  return new Date() > expiryDate;
};



  const { isLoading: createLoading } =
    useSelector((state) => state.AuthSlice.data.rproductcreate) || {};
  const getData = useSelector((state) => state.AuthSlice.data.rproductget);
  const products = getData?.data?.products || [];

  const [openModal, setOpenModal] = useState(false);

  const [form, setForm] = useState({
    productName: "",
    fermName: "",
    financeNumber: "",
    mail: "",
    warranty: "",
    contactNumber: "",
    extraDetails: "",
  });

  const [editingId, setEditingId] = useState(null);
const [editForm, setEditForm] = useState({});


  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await dispatch(rproductcreate(form));

      if (response?.payload?.success || response?.success) {
        toast.success("Product Created Successfully!");
        setForm({
          productName: "",
          fermName: "",
          financeNumber: "",
          mail: "",
          warranty: "",
          contactNumber: "",
          extraDetails: "",
        });
        setOpenModal(false);
        dispatch(rproductget());
      } else {
        toast.error("Could not create product.");
      }
    } catch (error) {
      toast.error("Something went wrong.");
    }
  };


  const handleEditClick = (product) => {
  setEditingId(product._id);
  setEditForm({
    productName: product.productName,
    fermName: product.fermName,
    financeNumber: product.financeNumber,
    mail: product.mail,
    warranty: product.warranty,
    contactNumber: product.contactNumber,
    extraDetails: product.extraDetails,
  });
};

const handleEditChange = (e) => {
  setEditForm({ ...editForm, [e.target.name]: e.target.value });
};

const handleUpdate = async (productId) => {
  try {
    const response = await dispatch(rproductupdate({ id: productId, ...editForm }));
    if (response?.payload?.success || response?.success) {
      toast.success("Product Updated Successfully!");
      setEditingId(null);
      dispatch(rproductget()); // Refresh list
    } else {
      toast.error("Could not update product.");
    }
  } catch (error) {
    toast.error("Something went wrong.");
  }
};

const handleCancelEdit = () => {
  setEditingId(null);
  setEditForm({});
};


  // ---------------- DOWNLOAD HELPERS ----------------

  // const triggerDownloadFromBase64 = (base64DataUrl, fileName) => {
  //   if (!base64DataUrl) return;

  //   const link = document.createElement("a");
  //   link.href = base64DataUrl; // already data:image/png;base64,...
  //   link.download = fileName;
  //   document.body.appendChild(link);
  //   link.click();
  //   document.body.removeChild(link);
  // };

  // const handleDownloadBarcode = (product) => {
  //   triggerDownloadFromBase64(
  //     product.barcodeImage,
  //     `${product.productName || "product"}-barcode.png`
  //   );
  // };

  // const handleDownloadQR = (product) => {
  //   triggerDownloadFromBase64(
  //     product.qrCode,
  //     `${product.productName || "product"}-qrcode.png`
  //   );
  // };


//   const handleDownloadSticker = (product) => {
//   const canvas = canvasRef.current;
//   if (!canvas || !product.barcodeImage || !product.qrCode) return;

//   const ctx = canvas.getContext("2d");

//   // Sticker size (you can tweak)
//   const width = 600;
//   const height = 800;
//   canvas.width = width;
//   canvas.height = height;

//   // White background
//   ctx.fillStyle = "#ffffff";
//   ctx.fillRect(0, 0, width, height);

//   // Load both images
//   const barcodeImg = new Image();
//   const qrImg = new Image();

//   barcodeImg.crossOrigin = "anonymous";
//   qrImg.crossOrigin = "anonymous";

//   barcodeImg.onload = () => {
//     qrImg.onload = () => {
//       ctx.fillStyle = "#ffffff";
//       ctx.fillRect(0, 0, width, height);

//       const padding = 40;

//       // draw barcode full width (keep aspect ratio)
//       const bRatio = barcodeImg.width / barcodeImg.height;
//       const bDrawWidth = width - padding * 2;
//       const bDrawHeight = bDrawWidth / bRatio;
//       ctx.drawImage(
//         barcodeImg,
//         padding,
//         padding,
//         bDrawWidth,
//         bDrawHeight
//       );

//       // draw QR below, centered
//       const qAvailableWidth = width - padding * 2;
//       const qSize = Math.min(qAvailableWidth, height - bDrawHeight - padding * 3);
//       const qX = (width - qSize) / 2;
//       const qY = padding * 2 + bDrawHeight;
//       ctx.drawImage(qrImg, qX, qY, qSize, qSize);

//       const dataUrl = canvas.toDataURL("image/png");
//       triggerDownloadFromBase64(
//         dataUrl,
//         `${product.productName || "product"}-sticker.png`
//       );
//     };
//     qrImg.src = product.qrCode;
//   };

//   barcodeImg.src = product.barcodeImage;
// };


  if (createLoading) return <LoadingScreen />;

  return (
    <div className={styles.container}>
      <button
        className={styles.openCreateBtn}
        onClick={() => setOpenModal(true)}
      >
        + Create Product
      </button>

      {openModal && (
        <div className={styles.modalBackdrop}>
          <div className={styles.modalBox}>
            <h2 className={styles.formTitle}>Create New Product</h2>

            <form onSubmit={handleSubmit}>
              <div className={styles.inputGroup}>
                <label>Product Name</label>
                <input
                  name="productName"
                  value={form.productName}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className={styles.inputGroup}>
                <label>Ferm Name</label>
                <input
                  name="fermName"
                  value={form.fermName}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className={styles.inputGroup}>
                <label>Finance Number</label>
                <input
                  name="financeNumber"
                  value={form.financeNumber}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className={styles.inputGroup}>
                <label>Warranty (months)</label>
                <input
                  type="number"
                  name="warranty"
                  value={form.warranty}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className={styles.inputGroup}>
                <label>Contact Number</label>
                <input
                  name="contactNumber"
                  value={form.contactNumber}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className={styles.inputGroup}>
                <label>Mail</label>
                <input
                  name="mail"
                  value={form.mail}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className={styles.inputGroup}>
                <label>Extra Details</label>
                <input
                  name="extraDetails"
                  value={form.extraDetails}
                  onChange={handleChange}
                />
              </div>

              <div className={styles.modalActions}>
                <button
                  type="button"
                  className={styles.cancelBtn}
                  onClick={() => setOpenModal(false)}
                >
                  Cancel
                </button>
                <button type="submit" className={styles.submitBtn}>
                  Create
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <section className={styles.productsList}>
        {products.map((product) => (
//           <article key={product._id} className={styles.productCard}>
//             {/* <h3 className={styles.productHeader}>{product.productName}</h3> */}
//             <h3 className={styles.productHeader}>
//   {product.productName}
// </h3>

// {isWarrantyExpired(product.createdAt, product.warranty) ? (
//   <span className={styles.expiredBadge}>❌ Expired</span>
// ) : (
//   <span className={styles.activeBadge}>✅ Under Warranty</span>
// )}


//             <div className={styles.productMeta}>
//               <p>
//                 <span>Ferm:</span> {product.fermName}
//               </p>
//               <p>
//                 <span>Warranty:</span> {product.warranty} months
//               </p>
//               <p>
//   <span>Created:</span>{" "}
//   {product.createdAt
//     ? new Date(product.createdAt).toLocaleDateString()
//     : "-"}
// </p>

// <p>
//   <span>Warranty Expiry:</span>{" "}
//   {getWarrantyExpiryDate(product.createdAt, product.warranty)}
// </p>

//               <p>
//                 <span>Contact:</span> {product.contactNumber}
//               </p>
//               {product.extraDetails && (
//                 <p>
//                   <span>Details:</span> {product.extraDetails}
//                 </p>
//               )}
//             </div>

//             <div className={styles.codesColumn}>
//   {product.barcodeImage && (
//     <img
//       src={product.barcodeImage}
//       alt="Barcode"
//       className={styles.barcodeImg}
//     />
//   )}

//   {product.qrCode && (
//     <img
//       src={product.qrCode}
//       alt="QR Code"
//       className={styles.qrImage}
//     />
//   )}
// </div>

//             <div className={styles.actionsRow}>
//   <button
//     type="button"
//     className={styles.downloadBtn}
//     onClick={() => handleDownloadSticker(product)}
//   >
//     Download Sticker
//   </button>
// </div>

//           </article>

<article key={product._id} className={styles.productCard}>
  {editingId === product._id ? (
    // Edit Form (Inline)
    <div className={styles.editForm}>
      <div className={styles.inputGroup}>
        <label>Product Name</label>
        <input
          name="productName"
          value={editForm.productName}
          onChange={handleEditChange}
          required
        />
      </div>
      <div className={styles.inputGroup}>
        <label>Ferm Name</label>
        <input
          name="fermName"
          value={editForm.fermName}
          onChange={handleEditChange}
          required
        />
      </div>
      <div className={styles.inputGroup}>
        <label>Finance Number</label>
        <input
          name="financeNumber"
          value={editForm.financeNumber}
          onChange={handleEditChange}
          required
        />
      </div>
      <div className={styles.inputGroup}>
        <label>Mail</label>
        <input
          name="mail"
          value={editForm.mail}
          onChange={handleEditChange}
          required
        />
      </div>
      {/* Add other inputs similarly, or abbreviate for space */}
      <div className={styles.inputGroup}>
        <label>Warranty (months)</label>
        <input
          type="number"
          name="warranty"
          value={editForm.warranty}
          onChange={handleEditChange}
          required
        />
      </div>
      <div className={styles.inputGroup}>
        <label>Contact Number</label>
        <input
          name="contactNumber"
          value={editForm.contactNumber}
          onChange={handleEditChange}
          required
        />
      </div>
      <div className={styles.inputGroup}>
        <label>Extra details</label>
        <input
          name="extraDetails"
          value={editForm.extraDetails}
          onChange={handleEditChange}
          required
        />
      </div>
      <div className={styles.modalActions}>
        <button
          type="button"
          className={styles.cancelBtn}
          onClick={handleCancelEdit}
        >
          Cancel
        </button>
        <button
          type="button"
          className={styles.submitBtn}
          onClick={() => handleUpdate(product._id)}
        >
          Update
        </button>
        {/* {editForm.extraDetails && (
          <label className={styles.switchLabel}>
            <input
              type="checkbox"
              checked={false} // Toggle logic for regenerateCodes
              onChange={(e) => console.log('Regenerate codes')} // Connect if needed
            />
            Regenerate Codes
          </label>
        )} */}
      </div>
    </div>
  ) : (
    // View Mode
    <>
      <div className={styles.productHeaderRow}>
        <h3 className={styles.productHeader}>{product.productName}</h3>
        <button
          className={styles.editBtn}
          onClick={() => handleEditClick(product)}
        >
          ✏️ Edit
        </button>
      </div>

      {isWarrantyExpired(product.createdAt, product.warranty) ? (
        <span className={styles.expiredBadge}>❌ Expired</span>
      ) : (
        <span className={styles.activeBadge}>✅ Under Warranty</span>
      )}

      {/* Rest of your existing view JSX: productMeta, codesColumn, actionsRow */}
    </>
  )}
</article>

        ))}
      </section>
      <canvas ref={canvasRef} style={{ display: "none" }} />

    </div>
  );
};

export default Products;
