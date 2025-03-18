import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function LoginScreen() {
  const navigate = useNavigate();
  const [credentials, setCredentials] = useState({
    username: "",
    password: "",
  });

  const handleInput = (e) => {
    setCredentials({
      ...credentials,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      console.log("starting the request")
      let response = await axios.post(
        `${import.meta.env.VITE_API_PATH || ""}/login`,
        credentials
      );
      console.log("ending the request")

      console.log(`Bearer ${response.data}`);
      localStorage.setItem("Authorization", `Bearer ${response.data}`);
      navigate("/");
    } catch (error) {
      console.error("an error uccured during login");
    }
  };

  return (
    <div className="vh-100 flex align-items-center justify-content-center">
      <form
        className="translateY--20 p-1 w-fit-content"
        onSubmit={handleSubmit}
      >
        <h1>Login</h1>
        <div className="input-group">
          <label htmlFor="username">Username</label>
          <input
            id="username"
            name="username"
            type="text"
            onChange={handleInput}
            required
          />
        </div>

        <div className="input-group">
          <label htmlFor="password">Password</label>
          <input
            id="password"
            name="password"
            type="password"
            onChange={handleInput}
            required
          />
        </div>

        <button type="submit" className="btn-primary ml-auto">
          Login
        </button>
      </form>
    </div>
  );
}
