import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { createProfile, getProfile, updateProfile } from "../services/profile.api";
import LoadingAnimation from "../components/LoadingAnimation";

function Profile() {
    const [profile, setProfile] = useState({
        goal: "",
        targetTimeFrame: "",
        experienceLevel: "BEGINNER",
        difficulty: "ADAPTIVE",
        helpPreference: "ADAPTIVE",
        learningStyle: "MIXED",
        availableHoursPerDay: 2
    });
    const [isEditing, setIsEditing] = useState(false);
    const [loading, setLoading] = useState(true);
    const [profileExists, setProfileExists] = useState(false);
    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            let response;

            if (profileExists) {
                response = await updateProfile(profile);
            } else {
                response = await createProfile(profile);
            }

            toast.success(
                response.data?.message ||
                (profileExists
                    ? "Profile updated successfully"
                    : "Profile created successfully")
            );

            setProfileExists(true);
            setIsEditing(false);

        } catch (error) {
            toast.error(
                error.response?.data?.error || "Failed to save profile"
            );
        }
    };
    useEffect(() => {
        const loadProfile = async () => {
            try {
                const response = await getProfile();

                setProfile({
                    ...response.data.profile,
                    targetTimeFrame: response.data.profile.targetTimeFrame
                        ? response.data.profile.targetTimeFrame.split("T")[0]
                        : ""
                });
                setIsEditing(false);
                setProfileExists(true);
            } catch (error) {
                // If profile doesn't exist, user can create one
                if (error.response?.status !== 404) {
                    toast.error(
                        error.response?.data?.error || "Something went wrong"
                    );
                }
            } finally {
                setLoading(false);
            }
        };

        loadProfile();
    }, []);
    if (loading) {
        return <LoadingAnimation />;
    }
    return (

        <div>
            <form onSubmit={handleSubmit}>
                <h1>Your Learning Profile</h1>

                <label>What is your goal?</label>
                <textarea
                    placeholder="e.g. Become a backend developer"
                    value={profile.goal}
                    onChange={(e) =>
                        setProfile({ ...profile, goal: e.target.value })
                    }
                    disabled={profileExists && !isEditing}
                />

                <label>Target completion date</label>
                <input type="date" value={profile.targetTimeFrame}
                    onChange={(e) =>
                        setProfile({ ...profile, targetTimeFrame: e.target.value })
                    }
                    disabled={profileExists && !isEditing} />

                <label>Experience Level</label>
                <select value={profile.experienceLevel}
                    onChange={(e) =>
                        setProfile({ ...profile, experienceLevel: e.target.value })
                    }
                    disabled={profileExists && !isEditing}>
                    <option value="BEGINNER">Beginner</option>
                    <option value="INTERMEDIATE">Intermediate</option>
                    <option value="ADVANCED">Advanced</option>
                    <option value="EXPERT">Expert</option>
                </select>

                <label>Difficulty</label>
                <select value={profile.difficulty}
                    onChange={(e) =>
                        setProfile({ ...profile, difficulty: e.target.value })
                    }
                    disabled={profileExists && !isEditing}>
                    <option value="EASY">Easy</option>
                    <option value="MEDIUM">Medium</option>
                    <option value="HARD">Hard</option>
                    <option value="ADAPTIVE">Adaptive</option>
                </select>

                <label>Help Preference</label>
                <select value={profile.helpPreference}
                    onChange={(e) =>
                        setProfile({ ...profile, helpPreference: e.target.value })
                    }
                    disabled={profileExists && !isEditing}>
                    <option value="HINT_FIRST">Hint First</option>
                    <option value="PSEUDOCODE_FIRST">Pseudocode First</option>
                    <option value="SOLUTION_LAST">Solution Last</option>
                    <option value="ADAPTIVE">Adaptive</option>
                </select>

                <label>Learning Style</label>
                <select value={profile.learningStyle}
                    onChange={(e) =>
                        setProfile({ ...profile, learningStyle: e.target.value })
                    }
                    disabled={profileExists && !isEditing}>
                    <option value="VISUAL">Visual</option>
                    <option value="HANDS_ON">Hands On</option>
                    <option value="THEORY">Theory</option>
                    <option value="MIXED">Mixed</option>
                </select>

                <label>Available Hours Per Day</label>
                <input type="number" value={profile.availableHoursPerDay}
                    onChange={(e) =>
                        setProfile({ ...profile, availableHoursPerDay: Number(e.target.value) })
                    }
                    disabled={profileExists && !isEditing} />

                {!profileExists ? (
                    <button key="create" type="submit">Save Profile</button>
                ) : !isEditing ? (
                    <button
                        key="edit"
                        type="button"
                        onClick={() => setIsEditing(!isEditing)}
                    >
                        Edit Profile
                    </button>
                ) : (
                    <button key="update" type="submit">Update Profile</button>
                )}

            </form>
        </div>
    );
}

export default Profile;