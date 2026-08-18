const {z} = require('zod')

const profileValidation = z.object({
    goal: z.string().min(5).max(150),
    targetTimeFrame: z.coerce.date(),
    experienceLevel: z.enum(["BEGINNER","INTERMEDIATE","ADVANCED","EXPERT"]),
    difficulty: z.enum(["EASY","MEDIUM","HARD","ADAPTIVE"]),
    helpPreference: z.enum(["HINT_FIRST","PSEUDOCODE_FIRST","SOLUTION_LAST", "ADAPTIVE"]),
    learningStyle: z.enum(["VISUAL","HANDS_ON","THEORY","MIXED"]),
    availableHoursPerDay: z.int()
})

module.exports = {profileValidation}