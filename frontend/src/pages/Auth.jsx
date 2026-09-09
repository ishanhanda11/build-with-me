import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { ArrowRight } from "lucide-react";

import { login, register, getMe } from "../services/auth.api";
import "./Auth.css";

function Auth() {
    const [isLogin, setIsLogin] = useState(true);
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [submitting, setSubmitting] = useState(false);
    const [checkingAuth, setCheckingAuth] = useState(true);

    const navigate = useNavigate();

    useEffect(() => {
        let isMounted = true;

        const verifyAuth = async () => {
            try {
                await getMe();
                if (isMounted) {
                    navigate("/", { replace: true });
                }
            } catch {
                if (isMounted) {
                    setCheckingAuth(false);
                }
            }
        };

        verifyAuth();

        return () => {
            isMounted = false;
        };
    }, [navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);

        if (isLogin) {
            try {
                const response = await login(email, password);
                if (response.data?.accessToken) {
                    localStorage.setItem("accessToken", response.data.accessToken);
                }
                if (response.data?.refreshToken) {
                    localStorage.setItem("refreshToken", response.data.refreshToken);
                }
                if (response.data?.user?.name) {
                    localStorage.setItem("userName", response.data.user.name);
                }
                toast.success(response.data?.message || "Login successful");
                navigate("/");
            } catch (error) {
                toast.error(
                    error.response?.data?.error ||
                    error.response?.data?.message

                );
            } finally {
                setSubmitting(false);
            }
        } else {
            try {
                const response = await register(name, email, password);
                if (response.data?.accessToken) {
                    localStorage.setItem("accessToken", response.data.accessToken);
                }
                if (response.data?.refreshToken) {
                    localStorage.setItem("refreshToken", response.data.refreshToken);
                }
                if (response.data?.user?.name) {
                    localStorage.setItem("userName", response.data.user.name);
                }
                toast.success(response.data?.message || "Registration successful");
                navigate("/");
            } catch (error) {
                toast.error(
                    error.response?.data?.message ||
                    error.response?.data?.error ||
                    "Something went wrong"
                );
            } finally {
                setSubmitting(false);
            }
        }
    };

    const handleSwitch = () => {
        setIsLogin((prev) => !prev);
        setName("");
        setEmail("");
        setPassword("");
    };

    if (checkingAuth) {
        return (
            <div className="auth-page">
                <div className="auth-card" style={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", minHeight: "260px" }}>
                    <div className="auth-brand-header" style={{ marginBottom: "16px" }}>
                        <svg
                            className="auth-emblem"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1.5"
                        >
                            <polygon points="12,2 22,20 2,20" />
                            <polygon points="12,7 18,18 6,18" stroke="#A43B2E" />
                            <line x1="12" y1="2" x2="12" y2="20" />
                        </svg>
                        <span className="auth-brand-name">BUILD WITH ME</span>
                    </div>
                    <div className="loading-text" style={{ fontSize: "14px", marginTop: "8px" }}>
                        Verifying session<span className="dots">...</span>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="auth-page">
            <div className="auth-card">
                <div className="auth-brand-header">
                    <svg
                        className="auth-emblem"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.5"
                    >
                        <polygon points="12,2 22,20 2,20" />
                        <polygon points="12,7 18,18 6,18" stroke="#A43B2E" />
                        <line x1="12" y1="2" x2="12" y2="20" />
                    </svg>
                    <span className="auth-brand-name">BUILD WITH ME</span>
                </div>

                <div className="auth-title-block">
                    <h1 className="auth-title">
                        {isLogin ? "Enter the Workshop" : "Begin Your Expedition"}
                    </h1>
                    <p className="auth-subtitle">
                        {isLogin
                            ? "Sign in to continue your developer journey."
                            : "Create an account to start building real projects."}
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="auth-form">
                    {!isLogin && (
                        <div className="auth-field">
                            <label className="auth-label" htmlFor="name">
                                Your Name
                            </label>
                            <input
                                id="name"
                                type="text"
                                className="auth-input"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="e.g. Arthur Morgan"
                                required
                            />
                        </div>
                    )}

                    <div className="auth-field">
                        <label className="auth-label" htmlFor="email">
                            Email Address
                        </label>
                        <input
                            id="email"
                            type="email"
                            className="auth-input"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="arthurmorgan@example.com"
                            required
                        />
                    </div>

                    <div className="auth-field">
                        <label className="auth-label" htmlFor="password">
                            Password
                        </label>
                        <input
                            id="password"
                            type="password"
                            className="auth-input"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="••••••••"
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        className="auth-submit-btn"
                        disabled={submitting}
                    >
                        <span>
                            {submitting
                                ? isLogin
                                    ? "Entering Workshop..."
                                    : "Creating Account..."
                                : isLogin
                                    ? "Enter Workshop"
                                    : "Create Account"}
                        </span>
                        {!submitting && <ArrowRight size={15} />}
                    </button>
                </form>

                <div className="auth-switch-box">
                    <span>
                        {isLogin
                            ? "Don't have an account?"
                            : "Already have an account?"}
                    </span>
                    <button
                        type="button"
                        onClick={handleSwitch}
                        className="auth-switch-btn"
                    >
                        {isLogin ? "Register" : "Sign In"}
                    </button>
                </div>
            </div>

            <p className="auth-footer-quote">
                &ldquo;The work is the way.&rdquo;
            </p>
        </div>
    );
}

export default Auth;