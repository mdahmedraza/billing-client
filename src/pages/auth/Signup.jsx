import React, { useState } from "react";
import styles from "./Signup.module.css";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {signup} from '../../redux/slices/authSlice';
import { toast } from "react-hot-toast";
import LoadingScreen from "../../components/LoadingScreen";

export default function Signup() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isLoading } = useSelector((state) => state.AuthSlice.data.signup);
  // const { isLoading: resendLoading } = useSelector(
  //   (state) => state.AuthSlice.data.resendOTP
  // );


  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");

const handleSubmit = async (e) => {
  e.preventDefault();

  if (!phone || !name) {
    toast.error("Please fill all the fields");
    return;
  }
  if (!phone.match(/^\d{10}$/)) {
    toast.error("Invalid phone number");
    return;
  }

  const response = await dispatch(signup({ name, phone }));

  if (response && response.success === true) {
    toast.success(response.message || "OTP sent successfully!");

    navigate("/otp", {
      state: {
        otpSessionId: response.otpSessionId,
        phone,
        name
      },
    });
  } else {
    toast.error(response?.message || "Failed! Try again.");
  }
};


  // const handleSubmit = async (e) => {
  //   e.preventDefault();
  //     if (
  //     !phone ||
  //     !name
  //   ) {
  //     toast.error("Please fill all the fields");
  //     return;
  //   }
  //   if (!phone.match(/^\d{10}$/)) {
  //     toast.error("Invalid phone number");
  //     return;
  //   }


  //     const response = await dispatch(signup({name: name, phone: phone}));
  //     if (response && response?.error === "false") {
        
  //       alert("any activiy in here as you wish");
  //       navigate("/otp");
        
        
  //     }
  // };

  if (isLoading) {
  // if (isLoading || resendLoading) {
    return <LoadingScreen />;
    // return <Loading />;
  }

  return (
    <div className={styles.signupContainer}>
      <div className={styles.signupCard}>
        <div className={styles.leftPanel}>
          <h2>Join the Admin Panel</h2>
          <p>Login to an account to manage products, orders, and analytics.</p>
          <div className={styles.infoCards}>
            <div className={styles.cardItem}>
              <h3>Fast Setup</h3>
              <p>Sign in with your phone and verify instantly.</p>
            </div>
            <div className={`${styles.cardItem} ${styles.highlight}`}>
              <h3>Secure</h3>
              <p>OTP verification ensures your account is protected.</p>
            </div>
          </div>
        </div>

        <div className={styles.formContainer}>
          <div className={styles.header}>
            <div>
              <h1>Create your account</h1>
              <p>Sign up with your name and mobile number</p>
            </div>
            <span className={styles.subText}>Dashboard</span>
          </div>

          <form onSubmit={handleSubmit} className={styles.form}>
            

            <label>Mobile Number</label>
            <div className={styles.phoneInput}>
              <span>+91</span>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="10-digit number"
              />
            </div>
            <label>Your Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="your name"
            />

            <button type="submit" className={styles.signupBtn}>Sign up</button>

            <p className={styles.loginLink}>
              Already have an account? <Link to="/" className={styles.link}>Sign in</Link>
            </p>

            <p className={styles.terms}>By signing up you agree to our Terms & Privacy.</p>
          </form>

          <div className={styles.footer}>© {new Date().getFullYear()} YourStore — Electronics Dashboard</div>
        </div>
      </div>
    </div>
  );
}
