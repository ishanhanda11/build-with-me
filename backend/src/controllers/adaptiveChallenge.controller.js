const { adaptChallengeService } = require("../services/adaptiveChallenge.service");

const adaptiveChallengeController = async (req, res, next) => {
  try {
    const userId = req.user.userId;

    if (!userId) {
      return res.status(401).json({
        message: "User not found"
      });
    }

    const { projectId } = req.params;

    if (!projectId) {
      return res.status(400).json({
        message: "Project ID does not exist"
      });
    }

    const newChallenges = await adaptChallengeService(
      userId,
      projectId
    );

    return res.status(201).json({
      message: "New challenges created successfully",
      challenges: newChallenges
    });

  } catch (err) {
    next(err);
  }
};

module.exports = {adaptiveChallengeController}