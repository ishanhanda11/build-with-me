import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getChallenges, getProjectById, generateAdaptiveChallenges } from "../services/project.api";
import LoadingAnimation from "../components/LoadingAnimation";
import toast from "react-hot-toast";

function Project() {
    const navigate = useNavigate();
    const { projectId } = useParams();
    const [challenges, setChallenges] = useState([]);
    const [project, setProject] = useState(null);

    const [loading, setLoading] = useState(true);
    const [generating, setGenerating] = useState(false);

    useEffect(() => {
        const fetchChallenges = async () => {
            try {
                const [challengesRes, projectRes] = await Promise.all([
                    getChallenges(projectId),
                    getProjectById(projectId)
                ]);
                console.log(challengesRes)
                setChallenges(challengesRes.challenges);
                setProject(projectRes.project);
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

    const isProjectCompleted = project?.status === "COMPLETED";
    const allChallengesCompleted = challenges.length > 0 && challenges.every(c => c.status === "COMPLETED");
    const canGenerateMore =
        allChallengesCompleted &&
        challenges.length < project?.maxChallenges;


    return (
        <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
                <h1>
                    Challenges ({challenges.filter(c => c.status === "COMPLETED").length} / {project?.maxChallenges})
                </h1>

                {canGenerateMore && (
                    <button
                        disabled={generating}
                        onClick={handleGenerateNext}
                    >
                        {generating ? "Generating Next Challenges..." : "Generate Next Challenges"}
                    </button>
                )}
            </div>

            {challenges.map((challenge) => (
                <div key={challenge.id} onClick={() => navigate(`/project/${projectId}/challenges/${challenge.id}`)} style={{ cursor: "pointer" }}>
                    <h2>{challenge.title}</h2>
                    <p>{challenge.description}</p>
                    <p>Status: {challenge.status}</p>
                </div>
            ))}

            {isProjectCompleted && (
                <div style={{ marginTop: "20px" }}>
                    <h2>🎉 Congratulations! Project Completed!</h2>
                </div>
            )}
        </div>
    );
}

export default Project;