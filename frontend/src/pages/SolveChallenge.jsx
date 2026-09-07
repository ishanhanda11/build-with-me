import { Editor } from "@monaco-editor/react";
import { useEffect, useState } from "react";
import { submitSolution } from "../services/project.api";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import { requestHelp, getAllHelpHistory } from "../services/requestHelp.api";
function SolveChallenge() {
    const [solution, setSolution] = useState(``);
    const { challengeId, projectId } = useParams();
    const [helpHistory, setHelpHistory] = useState([]);
    const [submitting, setSubmitting] = useState(false);
    const [requestingHelp, setRequestingHelp] = useState(null);
    const navigate = useNavigate()
    const handleSubmit = async () => {
        try {
            setSubmitting(true);
            const response = await submitSolution(challengeId, solution);
            const evaluation = response.response.evaluation;
            const historyResponse = await getAllHelpHistory(challengeId);
            setHelpHistory(historyResponse.result);
            if (evaluation.logicCorrectness) {
                if (response.response.newChallengesGenerated) {
                    toast.success("New challenges generated!");

                    setTimeout(() => {
                        navigate(`/projects/${projectId}`);
                    }, 1000);
                } else {
                    toast.success("Challenge completed successfully!");
                }
            } else {
                toast.error("Solution failed. Check the evaluation.");
            }
        } catch (error) {
            toast.error(error.response?.data?.error || "Something went wrong");
        } finally {
            setSubmitting(false);
        }
    };
    const handleRequest = async (helpType, challengeId) => {
        try {
            setRequestingHelp(helpType);
            await requestHelp(helpType, challengeId);
            const historyResponse = await getAllHelpHistory(challengeId);
            setHelpHistory(historyResponse.result);
            toast.success(`${helpType} received successfully`);
        } catch (error) {
            toast.error(error.response?.data?.error || "Something went wrong");
        } finally {
            setRequestingHelp(null);
        }
    }
    useEffect(() => {
        const fetchHelpHistory = async () => {
            try {
                const response = await getAllHelpHistory(challengeId)
                setHelpHistory(response.result)
            } catch (error) {
                toast.error(
                    error.response?.data?.error || "Failed to load help history"
                );
            }
        }
        fetchHelpHistory()
    }, [challengeId])
    return (
        <div className="solve-container">

            <div className="editor-section">
                <Editor
                    height="500px"
                    defaultLanguage="javascript"
                    defaultValue="// Write your solution here"
                    theme="vs-dark"
                    onChange={(value) => setSolution(value || "")}
                />

                <button
                    disabled={submitting}
                    onClick={handleSubmit}
                >
                    {submitting ? "Submitting..." : "Submit Solution"}
                </button>
            </div>

            <div className="ai-help-section">
                <h2>AI Help</h2>

                <div className="help-buttons">
                    <button
                        disabled={requestingHelp !== null || submitting}
                        onClick={() => handleRequest("hint", challengeId)}
                    >
                        {requestingHelp === "hint" ? "Requesting..." : "Hint"}
                    </button>

                    <button
                        disabled={requestingHelp !== null || submitting}
                        onClick={() => handleRequest("pseudocode", challengeId)}
                    >
                        {requestingHelp === "pseudocode"
                            ? "Requesting..."
                            : "Pseudocode"}
                    </button>

                    <button
                        disabled={requestingHelp !== null || submitting}
                        onClick={() => handleRequest("solution", challengeId)}
                    >
                        {requestingHelp === "solution"
                            ? "Requesting..."
                            : "Solution"}
                    </button>
                </div>
                {helpHistory.map((help) => (
                    <div className="help-content" key={help.id}>

                        {/* HINT */}
                        {help.type === "HINT" && (
                            <div>
                                <h3>Hint</h3>
                                <p>{help.content.hint}</p>
                            </div>
                        )}

                        {/* PSEUDOCODE */}
                        {help.type === "PSEUDOCODE" && (
                            <div>
                                <h3>Pseudocode</h3>

                                <ol>
                                    {help.content.pseudocode.map((step, index) => (
                                        <li key={index}>{step}</li>
                                    ))}
                                </ol>
                            </div>
                        )}

                        {/* SOLUTION */}
                        {help.type === "SOLUTION" && (
                            <div>
                                <h3>AI Solution</h3>

                                <h4>{help.content.title}</h4>

                                <p>{help.content.explanation}</p>

                                <pre>
                                    <code>{help.content.code}</code>
                                </pre>
                            </div>
                        )}

                        {/* USER SOLUTION */}
                        {help.type === "USER_SOLUTION" && (
                            <div>
                                <h3>Your Submission</h3>

                                <pre>
                                    <code>{help.content}</code>
                                </pre>
                            </div>
                        )}

                        {/* EVALUATION */}
                        {help.type === "EVALUATION" && (
                            <div>
                                <h3>AI Evaluation</h3>

                                <p>
                                    <strong>Logic:</strong>{" "}
                                    {help.content.logicCorrectness
                                        ? "Correct"
                                        : "Incorrect"}
                                </p>

                                <p>
                                    <strong>Syntax:</strong>{" "}
                                    {help.content.syntaxCorrectness
                                        ? "Correct"
                                        : "Incorrect"}
                                </p>

                                <p>
                                    <strong>Feedback:</strong>
                                </p>

                                <p>{help.content.feedback}</p>
                            </div>
                        )}

                    </div>
                ))}
            </div>

        </div>
    );
}

export default SolveChallenge;