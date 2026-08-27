const { getChallengeForUser, getLastChallenge, getPreviousChallenges } = require("../repositories/challenge.respository");
const { createChallenge, getProjectById } = require("../repositories/project.repository");
const { generateAdaptiveChallenges } = require("./ai.service");
const { getAllAttemptsService } = require("./challengeAttempt.service");
const { getProfile } = require("./profile.service");

const adaptChallengeService = async (userId, projectId) => {
  const project = await getProjectById(projectId,userId)
  if(!project){
    const err = new Error(
      "Project with this id does not exist."
    );
    err.statusCode = 404;
    throw err;
  }

  // Get the previous 2 challenges
  const previousChallenges = await getPreviousChallenges(projectId);
  previousChallenges.reverse()

  // The latest 2 challenges must exist before starting an adaptive cycle
  if (previousChallenges.length < 2) {
    const err = new Error(
      "Adaptive challenges cannot be generated yet."
    );
    err.statusCode = 400;
    throw err;
  }

  // Both previous challenges must be completed
  const allCompleted = previousChallenges.every(
    challenge => challenge.status === "COMPLETED"
  );

  if (!allCompleted) {
    const err = new Error(
      "Previous challenges must be completed before generating new challenges."
    );
    err.statusCode = 400;
    throw err;
  }

  // Get attempts for both previous challenges
  const attempts = [];

  for (const challenge of previousChallenges) {
    const challengeAttempts = await getAllAttemptsService(
      challenge.id,
      userId
    );

    attempts.push(...challengeAttempts);
  }

  const { profile: learnerProfile } = await getProfile(userId);

  const generated = await generateAdaptiveChallenges(
    learnerProfile,
    previousChallenges,
    attempts
  );

  const lastChallenge = await getLastChallenge(projectId);

  let nextOrder = lastChallenge
    ? lastChallenge.challengeOrder + 1
    : 1;

  const newChallenges = [];

  for (const challenge of generated.challenges) {

    const newChallenge = await createChallenge({
      projectId,
      title: challenge.title,
      description: challenge.description,
      difficulty: challenge.difficulty,
      learningObjectives: challenge.learningObjectives,
      challengeOrder: nextOrder
    });

    newChallenges.push(newChallenge);

    nextOrder++;
  }

  return newChallenges;
};

module.exports = {adaptChallengeService}