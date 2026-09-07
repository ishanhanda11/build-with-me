import "./index.css"
import { Routes, Route } from "react-router-dom";
import Auth from "./pages/Auth";
import Projects from "./pages/Projects";
import Project from "./pages/Project";
import Challenge from "./pages/Challenge";
import Chat from "./pages/Chat";
import SolveChallenge from "./pages/SolveChallenge";
import Profile from "./pages/Profile";
import ProfileGuard from "./components/ProfileGuard";
import Dashboard from "./pages/DashBoard";

function App() {
  return (
    <Routes>
      <Route path="/" element={<ProfileGuard><Dashboard /></ProfileGuard>} />
      <Route path="/auth" element={<Auth />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="/projects" element={<ProfileGuard><Projects /></ProfileGuard>} />
      <Route path="/projects/:projectId" element={<ProfileGuard><Project /></ProfileGuard>} />
      <Route path="/project/:projectId/challenges/:challengeId" element={<ProfileGuard><Challenge /></ProfileGuard>} />
      <Route
        path="/projects/:projectId/challenges/:challengeId/chat"
        element={<ProfileGuard><Chat /></ProfileGuard>}
      />

      <Route
        path="/projects/:projectId/challenges/:challengeId/solve"
        element={<ProfileGuard><SolveChallenge /></ProfileGuard>}
      />
    </Routes>
  );
}

export default App;