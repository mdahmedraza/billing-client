
import React, {  useState } from "react";
import styles from "./Login.module.css";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {rlogin} from '../../redux/slices/authSlice';
import { toast } from "react-hot-toast";
import LoadingScreen from "../../components/LoadingScreen";

export default function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isLoading } = useSelector((state) => state.AuthSlice.data.rlogin);

  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
      if (
      !phone ||
      !password
    ) {
      toast.error("Please fill all the fields");
      return;
    }
    if (!phone.match(/^\d{10}$/)) {
      toast.error("Invalid phone number");
      return;
    }

    try {
      const response = await dispatch(rlogin({phone, password}));
      if (response?.success) {
      navigate("/admin");
      }
    
      

      console.log("Response:", response);
    } catch (error) {
      toast.error("An unexpected error occurred. Please try again.");
    }

  };

  
    if (isLoading) {
        return <LoadingScreen />;
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
              <h1>Sign to your account</h1>
              <p>Sign in with your password and mobile number</p>
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
            <label>Your Password</label>
            <input
              type="text"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="your password"
            />

            <button type="submit" className={styles.signupBtn}>Sign in</button>

            <p className={styles.loginLink}>
              Don't have an account? <Link to="/signup" className={styles.link}>Signup</Link>
            </p>

            <p className={styles.terms}>By signing up you agree to our Terms & Privacy.</p>
          </form>

          <div className={styles.footer}>© {new Date().getFullYear()} YourStore — Electronics Dashboard</div>
        </div>
      </div>
    </div>
  );
}



