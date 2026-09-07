import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { getProfile } from "../services/profile.api";

function ProfileGuard({ children }) {
    const [loading, setLoading] = useState(true);
    const [profileExists, setProfileExists] = useState(false);

    useEffect(() => {
        const checkProfile = async () => {
            try {
                await getProfile();
                setProfileExists(true);
            } catch (error) {
                if (error.response?.status === 404) {
                    setProfileExists(false);
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

    if (!profileExists) {
        return <Navigate to="/profile" replace />;
    }

    return children;
}

export default ProfileGuard;