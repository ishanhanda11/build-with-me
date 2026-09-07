import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getChallenges } from "../services/project.api";
import { useNavigate } from "react-router-dom";
import LoadingAnimation from "../components/LoadingAnimation";
function Project() {
    const navigate = useNavigate();
    const { projectId } = useParams();
    const [challenges, setChallenges] = useState([]);
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchChallenges = async () => {
            try {
                const response = await getChallenges(projectId);
                setChallenges(response.challenges);
            } catch (error) {
                console.log(error);
            } finally {
                setLoading(false)
            }
        };

        fetchChallenges();
    }, [projectId]);
    if (loading) {
        return <LoadingAnimation />
    }
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
        </div>
    );
}

export default Project;