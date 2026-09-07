import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { getProfile } from "../services/profile.api";

function ProfileGuard({ children }) {
    const [loading, setLoading] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [profileExists, setProfileExists] = useState(false);

    useEffect(() => {
        const checkProfile = async () => {
            try {
                await getProfile();
                setIsAuthenticated(true);
                setProfileExists(true);
            } catch (error) {
                if (error.response?.status === 401) {
                    setIsAuthenticated(false);
                } else if (error.response?.status === 404) {
                    setIsAuthenticated(true);
                    setProfileExists(false);
                } else {
                    setIsAuthenticated(false);
                }
            } finally {
                setLoading(false);
            }
        };

        checkProfile();
    }, []);

    if (loading) {
        return (
            <div className="loading-container" role="status" aria-live="polite">
                <img
                    src="/checkingProfile.gif"
                    alt="Loading"
                    className="loading-gif"
                />

                <div className="loading-text">
                    Checking profile<span className="dots">...</span>
                </div>
            </div>
        );
    }

    if (!isAuthenticated) {
        return <Navigate to="/auth" replace />;
    }

    if (!profileExists) {
        return <Navigate to="/profile" replace />;
    }

    return children;
}

export default ProfileGuard;