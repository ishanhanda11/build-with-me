import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getChallenge } from "../services/project.api";
import LoadingAnimation from "../components/LoadingAnimation";

function Challenge() {
    const { challengeId, projectId } = useParams();
    const [challenge, setChallenge] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate()
    useEffect(() => {
        const fetchChallenge = async () => {
            try {
                const response = await getChallenge(projectId, challengeId);
                setChallenge(response.challenge);
            } catch (error) {
                console.log(error);
            } finally {
                setLoading(false)
            }
        };

        fetchChallenge();
    }, [challengeId, projectId]);

    if (loading) {
        return <LoadingAnimation />;
    }

    return (
        <div>
            <h1>{challenge.title}</h1>
            <p>{challenge.description}</p>
            <p>Difficulty: {challenge.difficulty}</p>

            <h3>Learning Objectives</h3>
            <ul>
                {challenge.learningObjectives.map((objective) => (
                    <li key={objective}>{objective}</li>
                ))}

            </ul>
            <div>
                <button
                    onClick={() =>
                        navigate(`/projects/${challenge.projectId}/challenges/${challenge.id}/chat`)
                    }
                >
                    Chat
                </button>

                <button
                    onClick={() =>
                        navigate(`/projects/${challenge.projectId}/challenges/${challenge.id}/solve`)
                    }
                >
                    Solve Challenge
                </button>
            </div>

        </div>


    );
}

export default Challenge;