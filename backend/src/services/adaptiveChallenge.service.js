const { getChallengeForUser, getLastChallenge, getPreviousChallenges, getChallengeCount } = require("../repositories/challenge.respository");
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
    return null
  }

  // Both previous challenges must be completed
  const allCompleted = previousChallenges.every(
    challenge => challenge.status === "COMPLETED"
  );

  if (!allCompleted) {
    return null
  }

  const challengeCount = await getChallengeCount(projectId)
  if (challengeCount >= project.maxChallenges) {
    return null;
}

  const remainingSlots = project.maxChallenges - challengeCount;
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
  const challengesToCreate = generated.challenges.slice(0, remainingSlots);
  const newChallenges = [];

  for (const challenge of challengesToCreate) {

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