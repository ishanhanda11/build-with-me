const { z } = require("zod");

const createProjectValidation = z.object({
  title: z.string().min(5).max(150),
  description: z.string().max(1000).optional(),

});



const generatedProjectValidation = z.object({
  title: z.string().min(5).max(150),
  description: z.string().max(1000),
  maxChallenges: z.number().min(8).max(20),
  challenges: z.array(
    z.object({
      title: z.string().min(3).max(150),
      description: z.string().max(1000),
      difficulty: z.enum([
        "EASY",
        "MEDIUM",
        "HARD",
      ]),
      learningObjectives: z.array(z.string()).min(1)
    })
  )
});

const updateProjectValidation = z.object({
  status: z.enum(['ACTIVE','PAUSED','ABANDONED'])
})

module.exports = {
  generatedProjectValidation, createProjectValidation, updateProjectValidation
};