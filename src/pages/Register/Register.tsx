import { type FormEvent, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { registerUser } from "../../services/authService";
import styles from "./Register.module.css";

export const Register = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    name: "",
    surname: "",
    cellNumber: "",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();

    setError("");
    setSuccess("");

    if (!formData.email || !formData.password || !formData.name || !formData.surname || !formData.cellNumber
    ) {
      setError("Please complete all fields.");
      return;
    }

    try {
      await registerUser(formData);

      setSuccess("Account created successfully!");

      setTimeout(() => {
        navigate("/");
      }, 1000);
    } catch (error) {
      console.error(error);
      setError("Unable to create account. Please try again.");
    }
  };

  return (
    <main className={styles.register}>
      <div className={styles.wrapper}>
        <h1>Create an Account</h1>

        <p className={styles.subtitle}>Enter your details to create an account.</p>

        {error && (
          <p className={styles.errorMessage}>{error}</p>
        )}

        {success && (
          <p className={styles.successMessage}>{success}</p>
        )}

        <form onSubmit={handleSubmit}>
          
          <div className={styles.inputGroup}>
            <label htmlFor="name">n</label>

            <input id="name" name="name" type="text" value={formData.name} onChange={handleChange}
              placeholder="Name" required/>
          </div>

        
          <div className={styles.inputGroup}>
            <label htmlFor="surname">s</label>

            <input id="surname" name="surname" type="text" value={formData.surname} onChange={handleChange}
              placeholder="Surname" required/>
          </div>

      
          <div className={styles.inputGroup}>
            <label htmlFor="email">@</label>

            <input id="email" name="email" type="email" value={formData.email}onChange={handleChange}
              placeholder="Email" required/>
          </div>
          
          <div className={styles.inputGroup}>
            <label htmlFor="cellNumber">c</label>

            <input id="cellNumber" name="cellNumber" type="tel" value={formData.cellNumber} onChange={handleChange}
              placeholder="Cell number" required/>
          </div>
          <div className={styles.inputGroup}>
            <label htmlFor="password">p</label>
            <input id="password" name="password" type="password" value={formData.password} onChange={handleChange}
              placeholder="Password" required/>
          </div>

          <button type="submit">Sign Up</button>
        </form>
        <p className={styles.accountText}>Already have an account?{" "}<Link to="/">Log In</Link></p>
      </div>
    </main>
  );
};