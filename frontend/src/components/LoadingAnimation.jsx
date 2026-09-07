function LoadingAnimation() {
    return (
        <div className="loading-container">
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