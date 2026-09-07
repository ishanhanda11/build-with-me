import { useState } from "react";
import { login, register } from "../services/auth.api";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

function Auth() {
    const [isLogin, setIsLogin] = useState(true);
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (isLogin) {
            try {
                const response = await login(email, password);

                toast.success(response.data?.message || "Login successful");
                navigate("/projects");
            } catch (error) {
                toast.error(
                    error.response?.data?.message || "Something went wrong"
                );
            }
        } else {
            try {
                const response = await register(name, email, password);
                toast.success(response.data?.message || "Registration successful");
                navigate("/projects");
            } catch (error) {
                toast.error(
                    error.response?.data?.message || "Something went wrong"
                );
            }
        }
    };

    const handleSwitch = () => {
        setIsLogin(!isLogin);
        setEmail("");
        setPassword("");
        setName("");
    };

    return (
        <div className="auth-container">
            <h1>{isLogin ? "Login" : "Register"}</h1>

            <form onSubmit={handleSubmit}>
                {!isLogin && (
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Name"
                        required
                    />
                )}
                <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Email"
                    required
                />

                <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Password"
                    required
                />

                <button type="submit">
                    {isLogin ? "Login" : "Register"}
                </button>
            </form>

            <p>
                {isLogin
                    ? "Don't have an account?"
                    : "Already have an account?"}

                <button type="button" onClick={handleSwitch}>
                    {isLogin ? "Register" : "Login"}
                </button>
            </p>
        </div>
    );
}

export default Auth;