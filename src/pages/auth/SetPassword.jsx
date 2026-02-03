import React, { useEffect, useState } from "react";
import styles from "./SetPassword.module.css";
import {  useNavigate, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {rpassword} from '../../redux/slices/authSlice';
import { toast } from "react-hot-toast";
import LoadingScreen from "../../components/LoadingScreen";

export default function SetPassword() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const { sessionToken } = location.state || {};
  console.log("comming data token...", sessionToken);

  
    const SessionToken = sessionToken || null;
  
    useEffect(() => {
      if (!SessionToken) {
        toast.error("Token expired! Please resend again.");
        navigate("/signup");
      }
    }, [SessionToken, navigate]);

  const { isLoading } = useSelector((state) => state.AuthSlice.data.rpassword);

  
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");

  // Password Rules
  const rules = {
    length: password.length >= 8 && password.length <= 20,
    uppercase: /[A-Z]/.test(password),
    lowercase: /[a-z]/.test(password),
    number: /[0-9]/.test(password),
    special: /[@$!%*?&#]/.test(password),
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!password || !confirm) {
      toast.error("Please fill all fields");
      return;
    }

    if (password !== confirm) {
      toast.error("Passwords do not match");
      return;
    }

    if (!Object.values(rules).every(Boolean)) {
      toast.error("Password does not meet requirements");
      return;
    }

    // console.log("Password Saved:", password);
    // toast.success("Password successfully set!");
          const response = await dispatch(rpassword({ password, sessionToken }));
          
            if (response && response.success === true) {
              toast.success(response.message || "OTP sent successfully!");
          
              navigate("/", {
                // state: {
                //   sessionToken: response.sessionToken,
                // },
              });
            } else {
              toast.error(response?.message || "Failed! Try again.");
            }
  };

  if (isLoading) {
      return <LoadingScreen />;
    }

  return (
    <div className={styles.signupContainer}>
      <div className={styles.signupCard}>
        
        {/* Left panel */}
        <div className={styles.leftPanel}>
          <h2>Secure Your Account</h2>
          <p>Set a strong password to protect your dashboard.</p>
          <div className={styles.infoCards}>
            <div className={styles.cardItem}>
              <h3>Strong Password</h3>
              <p>Add uppercase, numbers, and symbols.</p>
            </div>
            <div className={`${styles.cardItem} ${styles.highlight}`}>
              <h3>Protected</h3>
              <p>Your account stays safe and encrypted.</p>
            </div>
          </div>
        </div>

        {/* Right side form */}
        <div className={styles.formContainer}>
          <div className={styles.header}>
            <div>
              <h1>Set Your Password</h1>
              <p>Create a secure password for login</p>
            </div>
            <span className={styles.subText}>Dashboard</span>
          </div>

          <form onSubmit={handleSubmit} className={styles.form}>

            <label>New Password</label>
            <input
              type="password"
              value={password}
              placeholder="Enter password"
              onChange={(e) => setPassword(e.target.value)}
            />

            <label>Confirm Password</label>
            <input
              type="password"
              value={confirm}
              placeholder="Re-enter password"
              onChange={(e) => setConfirm(e.target.value)}
            />

            {/* Password Requirements */}
            <div className={styles.passwordRules}>
              <p className={rules.length ? styles.valid : styles.invalid}>
                • Between 8 to 20 characters
              </p>
              <p className={rules.uppercase ? styles.valid : styles.invalid}>
                • At least one uppercase letter (A-Z)
              </p>
              <p className={rules.lowercase ? styles.valid : styles.invalid}>
                • At least one lowercase letter (a-z)
              </p>
              <p className={rules.number ? styles.valid : styles.invalid}>
                • At least one number (0-9)
              </p>
              <p className={rules.special ? styles.valid : styles.invalid}>
                • At least one special character (@ $ ! % * ? & #)
              </p>
            </div>

            <button type="submit" className={styles.signupBtn}>Save Password</button>

            <p className={styles.terms}>
              Password must meet all the above requirements.
            </p>
          </form>

          <div className={styles.footer}>
            © {new Date().getFullYear()} YourStore — Electronics Dashboard
          </div>
        </div>
      </div>
    </div>
  );
}
