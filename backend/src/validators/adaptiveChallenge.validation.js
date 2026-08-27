const { z } = require("zod");

const adaptiveChallengeValidation = z.object({
  challenges: z.array(
    z.object({
      title: z
        .string()
        .min(5)
        .max(150),

      description: z
        .string()
        .min(30)
        .max(500),

      difficulty: z.enum([
        "EASY",
        "MEDIUM",
        "HARD"
      ]),

      learningObjectives: z
      .array(z.string().min(5).max(150))
      .min(2)
    })
  ).length(2)
});
module.exports = {
  adaptiveChallengeValidation
};