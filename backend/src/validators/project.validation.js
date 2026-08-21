const { z } = require("zod");

const createProjectValidation = z.object({
  title: z.string().min(5).max(150),
  description: z.string().max(1000).optional()
});



const generatedProjectValidation = z.object({
  title: z.string().min(5).max(150),

  description: z.string().max(1000),

  challenges: z.array(
    z.object({
      title: z.string().min(3).max(150),
      description: z.string().max(1000),
      difficulty: z.enum([
        "EASY",
        "MEDIUM",
        "HARD",
        "ADAPTIVE"
      ]),
      learningObjectives: z.array(z.string()).min(1)
    })
  )
});

module.exports = {
  generatedProjectValidation, createProjectValidation
};