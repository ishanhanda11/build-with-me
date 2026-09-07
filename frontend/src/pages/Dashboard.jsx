import { Link } from "react-router-dom";

function Dashboard() {
    return (
        <div>
            <h1>Welcome back!</h1>

            <p>Continue your learning journey.</p>

            <Link to="/projects">
                + Generate New Project
            </Link>
        </div>
    );
}

export default Dashboard;