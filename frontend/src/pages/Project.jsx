import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getChallenges, generateAdaptiveChallenges } from "../services/project.api";
import LoadingAnimation from "../components/LoadingAnimation";
import toast from "react-hot-toast";

function Project() {
    const navigate = useNavigate();
    const { projectId } = useParams();
    const [challenges, setChallenges] = useState([]);
    const [loading, setLoading] = useState(true);
    const [generating, setGenerating] = useState(false);

    useEffect(() => {
        const fetchChallenges = async () => {
            try {
                const response = await getChallenges(projectId);
                setChallenges(response.challenges);
            } catch (error) {
                console.log(error);
            } finally {
                setLoading(false);
            }
        };

        fetchChallenges();
    }, [projectId]);

    const handleGenerateNext = async () => {
        try {
            setGenerating(true);
            const response = await generateAdaptiveChallenges(projectId);
            if (response.challenges && response.challenges.length > 0) {
                const updated = await getChallenges(projectId);
                setChallenges(updated.challenges);
                toast.success("New challenges generated!");
            } else {
                toast("No new challenges needed at this stage.");
            }
        } catch (error) {
            toast.error(error.response?.data?.error || error.response?.data?.message || "Failed to generate challenges");
        } finally {
            setGenerating(false);
        }
    };

    if (loading) {
        return <LoadingAnimation />;
    }

    const allCompleted = challenges.length > 0 && challenges.every(c => c.status === "COMPLETED");

    return (
        <div>
            <h1>Challenges</h1>

            {challenges.map((challenge) => (
                <div key={challenge.id} onClick={() => navigate(`/project/${projectId}/challenges/${challenge.id}`)} style={{ cursor: "pointer" }}>
                    <h2>{challenge.title}</h2>
                    <p>{challenge.description}</p>
                    <p>Status: {challenge.status}</p>
                </div>
            ))}

            {allCompleted && (
                <div style={{ marginTop: "20px" }}>
                    <button
                        disabled={generating}
                        onClick={handleGenerateNext}
                    >
                        {generating ? "Generating Next Challenges..." : "Generate Next Challenges"}
                    </button>
                </div>
            )}
        </div>
    );
}

export default Project;