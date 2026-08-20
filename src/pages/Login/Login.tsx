import { type FormEvent, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { loginUser } from "../../services/authService"
import { login } from "../../store/authSlice";
import type { AppDispatch } from "../../store/store";
import styles from "./Login.module.css";

export const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      const user = await loginUser(email, password);

      dispatch(login(user));

      navigate("/home");
    } catch (error) {
      console.error(error);

      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError("Unable to log in.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className={styles.login}>
      <div>
        <h1>Welcome</h1>
        <p>Enter your details to log in.</p>

        {error && <p>{error}</p>}

        <form onSubmit={handleSubmit}>
          <div>
            <label htmlFor="email">Email</label>
            <input id="email" type="email" value={email} onChange={(event) => setEmail(event.target.value)} required />
          </div>

          <div>
            <label htmlFor="password">Password</label>
            <input id="password" type="password" value={password} onChange={(event) => setPassword(event.target.value)} required />
          </div>

          <button type="submit" disabled={loading}> {loading ? "Logging in..." : "Log In"}</button>
        </form>

        <p>Don't have an account?{" "} <Link to="/register">Create Account</Link></p>
      </div>
    </main>
  );
};