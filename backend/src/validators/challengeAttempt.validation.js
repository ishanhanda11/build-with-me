const { z } = require("zod");

const updateChallengeAttemptValidation = z.object({
    status: z
        .enum(["FAILED", "IN_PROGRESS", "COMPLETED"])
        .optional(),

    hintsUsed: z.number().int().min(0).optional(),

    pseudocodeUsed: z.number().int().min(0).optional(),

    solutionUsed: z.number().int().min(0).optional()
});

module.exports = { updateChallengeAttemptValidation };