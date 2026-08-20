import { type FormEvent, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { registerUser } from "../../services/authService";

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

    if (
      !formData.email ||
      !formData.password ||
      !formData.name ||
      !formData.surname ||
      !formData.cellNumber
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
    <main>
      <h1>Create an Account</h1>
      <p>Enter your details to create an account.</p>

      {error && <p>{error}</p>}
      {success && <p>{success}</p>}

      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="email">Email</label>
          <input id="email" name="email" type="email" value={formData.email} onChange={handleChange} required />
        </div>

        <div>
          <label htmlFor="name">Name</label>
          <input id="name" name="name" type="text" value={formData.name} onChange={handleChange} required />
        </div>

        <div>
          <label htmlFor="surname">Surname</label>
          <input id="surname" name="surname" type="text" value={formData.surname} onChange={handleChange} required />
        </div>

        <div>
          <label htmlFor="cellNumber">Cell number</label>
          <input id="cellNumber" name="cellNumber" type="tel" value={formData.cellNumber} onChange={handleChange} required />
        </div>

        <div>
          <label htmlFor="password">Password</label>
          <input id="password" name="password" type="password" value={formData.password} onChange={handleChange} required />
        </div>

        <button type="submit">Sign Up</button>
      </form>

      <p>Already have an account?{" "}<Link to="/">Log In</Link></p>
    </main>
  );
};