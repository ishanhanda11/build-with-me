import { useEffect, useState } from "react";
import { createProject, getProjects } from "../services/project.api";
import { useNavigate } from "react-router-dom";
import { getProfile } from "../services/profile.api";
import toast from "react-hot-toast";
import LoadingAnimation2 from "../components/loadingAnimation2";
import LoadingAnimation from "../components/LoadingAnimation";

function Projects() {
    const navigate = useNavigate();
    const [projects, setProjects] = useState([]);
    const [loadingProjects, setLoadingProjects] = useState(true);
    const [generatingProject, setGeneratingProject] = useState(false);
    const generateProject = async () => {
        try {
            setGeneratingProject(true);

            const response = await getProfile();
            const profile = response.data.profile;

            if (!profile) {
                toast.error("Please fill your profile first");
                return;
            }

            const projectResponse = await createProject(profile);
            setProjects((prevProjects) => [
                ...prevProjects,
                projectResponse.project
            ]);
            toast.success(
                projectResponse.message || "Project generated successfully"
            );
            navigate(`/projects/${projectResponse.project.id}`)

        } catch (err) {
            toast.error(
                err.response?.data?.error || "Failed to generate project"
            );
        } finally {
            setGeneratingProject(false);
        }
    };
    useEffect(() => {
        const fetchProjects = async () => {
            try {
                const response = await getProjects();
                setProjects(response.projects);
            } catch (error) {
                console.log(error);
            } finally {
                setLoadingProjects(false)
            }
        };

        fetchProjects();
    }, []);
    if (generatingProject) {
        return <LoadingAnimation2 />;
    }
    if (loadingProjects) {
        return <LoadingAnimation />;
    }
    return (
        <div>
            <h1>My Projects</h1>
            <button onClick={generateProject}>
                + Generate New Project
            </button>
            {projects.map((project) => (
                <div key={project.id} onClick={() => navigate(`/projects/${project.id}`)}>
                    <h2>{project.title}</h2>
                    <p>{project.description}</p>
                </div>
            ))}
        </div>
    );
}

export default Projects;