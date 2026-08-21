const { GoogleGenAI } = require("@google/genai");
const {generatedProjectValidation} = require("../validators/project.validation");

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY
});

const generateProject = async (profile) => {
  const response = await ai.models.generateContent({
  model: "gemini-3.6-flash",

  contents: `Generate a learning project based on this profile:

Goal: ${profile.goal}
Experience: ${profile.experienceLevel}
Difficulty: ${profile.difficulty}
Learning style: ${profile.learningStyle}
Available hours: ${profile.availableHoursPerDay}
Target timeframe: ${profile.targetTimeFrame}
Help preference: ${profile.helpPreference}`,

  config: {
    responseMimeType: "application/json",

    responseSchema: {
      type: "object",
      properties: {
        title: {
          type: "string"
        },
        description: {
          type: "string"
        },
       challenges: {
  type: "array",
  items: {
    type: "object",
    properties: {
      title: {
        type: "string"
      },
      description: {
        type: "string"
      },
      difficulty: {
        type: "string",
        enum: ["EASY", "MEDIUM", "HARD", "ADAPTIVE"]
      },
      learningObjectives: {
        type: "array",
        items: {
          type: "string"
        }
      }
    },
    required: [
      "title",
      "description",
      "difficulty",
      "learningObjectives"
    ]
  }
}
      },
      required: ["title", "description", "challenges"]
    }
  }
});

  const project = JSON.parse(response.text);

const validatedProject =
  generatedProjectValidation.parse(project);

return validatedProject;
};

module.exports = generateProject