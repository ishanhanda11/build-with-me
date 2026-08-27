const z = require("zod");

const userSubmissionValidation = z.object({
  solution: z.string().min(2)
});

const geminiEvaluationValidation = z.object({
  logicCorrectness: z.boolean(),
  syntaxCorrectness: z.boolean(),
  feedback: z.string().min(2)
});

module.exports = {
  userSubmissionValidation,
  geminiEvaluationValidation
};