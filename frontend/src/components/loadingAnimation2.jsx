function LoadingAnimation2() {
    return (
        <div className="loading-container" role="status" aria-live="polite">
            <img
                src="/generateProject.gif"
                alt="Loading"
                className="loading-gif"
            />

            <div className="loading-text">
                Generating Project<span className="dots">...</span>
            </div>
        </div>
    );
}

export default LoadingAnimation2;