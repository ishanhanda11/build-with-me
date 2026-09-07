function ChallengeHelp() {
    return (
        <div>
            <h2>Challenge Help</h2>

            <div>
                <p>Gemini: How can I help you with this challenge?</p>
            </div>

            <div>
                <button>Hint</button>
                <button>Pseudocode</button>
                <button>Request Solution</button>
            </div>

            <textarea
                placeholder="Ask about the challenge..."
            />

            <button>Send</button>

            <h3>Your Solution</h3>

            <textarea
                placeholder="Write your solution here..."
            />

            <button>Submit Solution</button>
        </div>
    );
}

export default ChallengeHelp;