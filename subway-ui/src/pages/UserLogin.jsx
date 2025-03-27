import { useState } from "react";
import axios from "axios";
import {useNavigate} from "react-router-dom";

const UserLogin = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post("http://localhost:8080/api/users/login", { email, password });
            console.log("Token: "+response.data.token);
            if (response.data.token === "Login Successful!") {
                localStorage.setItem("token", response.data.token);
                navigate("/home");
            } else {
                alert("Invalid credentials");
            }
        } catch (error) {
            alert("Login failed. Please try again.");
        }
    };

    return (
        <div>
            <h2>Login</h2>
            <form onSubmit={handleLogin}>
                <input type="email" placeholder="Email" onChange={(e) => setEmail(e.target.value)} />
                <input type="password" placeholder="Password" onChange={(e) => setPassword(e.target.value)} />
                <button type="submit">Login</button>
            </form>
            <p>New user? <a href="/register">Register here</a></p>
        </div>
    );
};

export default UserLogin;
