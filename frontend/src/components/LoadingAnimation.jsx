function LoadingAnimation() {
    return (
        <div className="loading-container" role="status" aria-live="polite">
            <img
                src="/goku.gif"
                alt="Loading"
                className="loading-gif"
            />

            <div className="loading-text">
                Loading<span className="dots">...</span>
            </div>
        </div>
    );
}

export default LoadingAnimation;