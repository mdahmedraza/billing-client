import React, { useEffect, useRef, useState } from "react";
import styles from "./EnterOTP.module.css";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {rotp} from '../../redux/slices/authSlice';
import { toast } from "react-hot-toast";
import LoadingScreen from "../../components/LoadingScreen";

/**
 * EnterOTP component
 * - 6 input fields for OTP
 * - countdown from 54 seconds on mount or when Send/Resend clicked
 * - Resend button appears when timer reaches 0
 * - console.log on resend (as requested)
 */

export default function EnterOTP() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  
    const { isLoading } = useSelector((state) => state.AuthSlice.data.rotp);

  const { otpSessionId, phone, name } = location.state || {};
  console.log("comming data...", otpSessionId, phone, name)

  
    const OtpSessionId = otpSessionId || null;
  
    useEffect(() => {
      if (!OtpSessionId) {
        toast.error("Token expired! Please resend again.");
        navigate("/signup");
      }
    }, [OtpSessionId, navigate]);


  const DIGITS = 6;
  const START_SECONDS = 54;

  const [otp, setOtp] = useState(Array(DIGITS).fill(""));
  const inputRefs = useRef([]);
  const [seconds, setSeconds] = useState(START_SECONDS);
  const [isCounting, setIsCounting] = useState(true); // start counting on page load
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Start / continue countdown effect
  useEffect(() => {
    if (!isCounting) return;
    if (seconds <= 0) {
      setIsCounting(false);
      return;
    }

    const t = setTimeout(() => {
      setSeconds((s) => s - 1);
    }, 1000);

    return () => clearTimeout(t);
  }, [seconds, isCounting]);

  // helper to focus a particular input index
  const focusIndex = (idx) => {
    const el = inputRefs.current[idx];
    if (el) el.focus();
  };

  // handle input change per box
  const handleChange = (e, idx) => {
    const val = e.target.value.replace(/\D/g, ""); // digits only
    if (!val) {
      // clear current
      const next = [...otp];
      next[idx] = "";
      setOtp(next);
      return;
    }

    // if user types/pastes multiple digits, distribute them
    const chars = val.split("");
    const next = [...otp];
    let i = idx;
    chars.forEach((ch) => {
      if (i < DIGITS) {
        next[i] = ch;
        i += 1;
      }
    });
    setOtp(next);

    // focus the next empty
    const nextEmpty = next.findIndex((c, i2) => i2 > idx && !c);
    if (nextEmpty !== -1) focusIndex(nextEmpty);
    else if (idx + chars.length < DIGITS) focusIndex(idx + chars.length);
    else {
      // if all filled, blur last input
      const last = inputRefs.current[DIGITS - 1];
      last && last.blur();
    }
  };

  // handle keyboard navigation (backspace/left/right)
  const handleKeyDown = (e, idx) => {
    const key = e.key;

    if (key === "Backspace") {
      if (otp[idx]) {
        // just clear this one
        const next = [...otp];
        next[idx] = "";
        setOtp(next);
      } else if (idx > 0) {
        focusIndex(idx - 1);
        const next = [...otp];
        next[idx - 1] = "";
        setOtp(next);
      }
    }

    if (key === "ArrowLeft" && idx > 0) {
      focusIndex(idx - 1);
    }

    if (key === "ArrowRight" && idx < DIGITS - 1) {
      focusIndex(idx + 1);
    }
  };

  // paste handler: accept full OTP paste
  const handlePaste = (e) => {
    e.preventDefault();
    const paste = (e.clipboardData || window.clipboardData).getData("text");
    const digits = paste.replace(/\D/g, "").slice(0, DIGITS).split("");
    if (digits.length === 0) return;
    const next = Array(DIGITS).fill("");
    digits.forEach((d, i) => (next[i] = d));
    setOtp(next);
    // focus last filled or next
    const firstEmpty = next.findIndex((c) => !c);
    if (firstEmpty === -1) {
      inputRefs.current[DIGITS - 1].blur();
    } else {
      focusIndex(firstEmpty);
    }
  };

  // Submit OTP (simulate)
  const handleSubmit = async (e) => {
    e && e.preventDefault();
    const code = otp.join("");
    if (code.length < DIGITS) {
      toast.error("Please enter the full 6-digit OTP");
      return;
    }
    setIsSubmitting(true);
    // Simulate a verification call
    setTimeout(() => {
      // console.log("OTP submitted:", code);
      // toast.success("OTP submitted: " + code);
      setIsSubmitting(false);
      // navigate or whatever next action
    }, 700);
      const response = await dispatch(rotp({ otp: code, otpSessionId }));
      
        if (response && response.success === true) {
          toast.success(response.message || "OTP sent successfully!");
      
          navigate("/set-password", {
            state: {
              sessionToken: response.sessionToken,
            },
          });
        } else {
          toast.error(response?.message || "Failed! Try again.");
        }
  };

  // Send OTP (initial or by button)
  const sendOtp = () => {
    console.log("Send OTP clicked");
    toast.success("OTP sent to +91-xxxxxx");
    setOtp(Array(DIGITS).fill(""));
    inputRefs.current[0] && inputRefs.current[0].focus();
    setSeconds(START_SECONDS);
    setIsCounting(true);
  };

  // Resend OTP (only clickable when seconds === 0)
  const resendOtp = () => {
    console.log("Resend OTP clicked");
    toast.success("OTP resent");
    setOtp(Array(DIGITS).fill(""));
    inputRefs.current[0] && inputRefs.current[0].focus();
    setSeconds(START_SECONDS);
    setIsCounting(true);
  };

  // helper: format seconds as mm:ss or just seconds
  const formatTime = (s) => {
    const mm = Math.floor(s / 60);
    const ss = s % 60;
    return `${mm > 0 ? String(mm).padStart(2, "0") + ":" : ""}${String(ss).padStart(2, "0")}`;
  };

  if (isLoading) {
      return <LoadingScreen />;
    }

  return (
    <div className={styles.signupContainer}>
      <div className={styles.signupCard}>
        <div className={styles.leftPanel}>
          <h2>Verify your number</h2>
          <p>Enter the 6-digit code sent to your mobile. This keeps your admin dashboard secure.</p>

          <div className={styles.infoCards}>
            <div className={styles.cardItem}>
              <h3>Secure OTP</h3>
              <p>The code is valid for a short time — keep it private.</p>
            </div>
            <div className={`${styles.cardItem} ${styles.highlight}`}>
              <h3>Fast</h3>
              <p>One-tap resend after the timer ends.</p>
            </div>
          </div>
        </div>

        <div className={styles.formContainer}>
          <div className={styles.header}>
            <div>
              <h1>Enter verification code</h1>
              <p>We sent a 6-digit code to your mobile number (+91 ••••••••123)</p>
            </div>
            <span className={styles.subText}>OTP</span>
          </div>

          <form onSubmit={handleSubmit} className={styles.form}>
            <label>Enter OTP</label>
            <div
              className={styles.otpWrap}
              onPaste={handlePaste}
              aria-label="OTP input fields"
            >
              {Array.from({ length: DIGITS }).map((_, i) => (
                <input
                  key={i}
                  ref={(el) => (inputRefs.current[i] = el)}
                  inputMode="numeric"
                  pattern="\d*"
                  maxLength={1}
                  className={styles.otpInput}
                  value={otp[i]}
                  onChange={(e) => handleChange(e, i)}
                  onKeyDown={(e) => handleKeyDown(e, i)}
                  aria-label={`Digit ${i + 1}`}
                />
              ))}
            </div>

            <div className={styles.row}>
              <button
                type="submit"
                className={styles.signupBtn}
                disabled={isSubmitting}
              >
                {isSubmitting ? "Verifying..." : "Verify & Enter"}
              </button>

              <button
                type="button"
                className={`${styles.ghostBtn}`}
                onClick={sendOtp}
              >
                Send OTP
              </button>
            </div>

            <div className={styles.timerRow}>
              {isCounting && seconds > 0 ? (
                <p>Resend available in <strong>{formatTime(seconds)}</strong></p>
              ) : seconds === 0 ? (
                <button className={styles.resendBtn} onClick={resendOtp}>
                  Resend OTP
                </button>
              ) : (
                <p className={styles.infoText}>You can resend the code if needed.</p>
              )}
            </div>

            <p className={styles.loginLink}>
              Change number? <Link to="/login" className={styles.link}>Edit</Link>
            </p>

            <p className={styles.terms}>By verifying you agree to our Terms & Privacy.</p>
          </form>

          <div className={styles.footer}>© {new Date().getFullYear()} YourStore — Electronics Dashboard</div>
        </div>
      </div>
    </div>
  );
}
