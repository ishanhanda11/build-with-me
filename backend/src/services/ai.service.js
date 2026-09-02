const { GoogleGenAI } = require("@google/genai");
const { generatedProjectValidation } = require("../validators/project.validation");
const { adaptiveChallengeValidation } = require("../validators/adaptiveChallenge.validation");
const { geminiEvaluationValidation } = require("../validators/userSubmission.validation");
const { hintValidation, pseudocodeValidation, solutionValidation } = require("../validators/attemptHelp.validation");

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY
});

const generateProject = async (profile, previousProjects = []) => {

  const previousProjectContext = previousProjects.length > 0
    ? previousProjects
      .map(
        (project, index) =>
          `${index + 1}. Title: ${project.title}\n   Description: ${project.description}`
      )
      .join("\n")
    : "No previous projects exist.";

  const response = await ai.models.generateContent({
    model: "gemini-3.6-flash",

    contents: `
Generate a personalized, practical learning project based on the following learner profile.

Learner Profile:
- Goal: ${profile.goal}
- Experience Level: ${profile.experienceLevel}
- Preferred Difficulty: ${profile.difficulty}
- Learning Style: ${profile.learningStyle}
- Available Hours Per Day: ${profile.availableHoursPerDay}
- Target Timeframe: ${profile.targetTimeFrame}
- Help Preference: ${profile.helpPreference}

Previous Projects:
${previousProjectContext}

Project Requirements:

1. PERSONALIZATION
- Create a project that directly supports the learner's stated goal.
- Match the project's complexity to the learner's experience level,
  preferred difficulty, available time, and learning style.
- The project should teach skills that are relevant to the learner's goal,
  rather than adding technologies or concepts that are unrelated.

2. PROJECT QUALITY
- Create a realistic, practical project that resembles something a developer
  could actually build and use.
- Prefer projects that solve a concrete problem or simulate a realistic
  software system.
- The project should be valuable as a portfolio project.
- Avoid generic tutorial-style projects when a more realistic alternative
  would achieve the same learning goals.

3. ORIGINALITY
- Carefully review the previous projects before generating the new project.
- Do NOT substantially repeat any previous project.
- Do NOT reuse the same project concept, primary problem, domain, or
  overall functionality from a previous project.
- Do NOT simply rename an existing project or make a superficial variation.
- Explore a different use case or domain while remaining relevant to the
  learner's goal.
- Previous projects are provided specifically to prevent repetition.

4. CHALLENGE STRUCTURE
- Break the project into exactly 2 sequential coding challenges.
- Challenge 1 should establish the foundational concepts required for
  Challenge 2.
- Challenge 2 should naturally build upon Challenge 1 and introduce
  additional complexity.
- The two challenges must have clearly different objectives and should not
  simply repeat the same implementation.
- Both challenges must contribute directly to building the project.
- Each challenge must be independently understandable.

5. DIFFICULTY
- Assign each challenge a concrete difficulty: EASY, MEDIUM, or HARD.
- Difficulty should reflect the actual complexity of that challenge.
- The two challenges do not need to have the same difficulty.
- Challenge 2 can be more difficult than Challenge 1 when appropriate.

6. LEARNING OBJECTIVES
- Include clear, specific learning objectives for each challenge.
- Objectives should describe actual technical skills or concepts the learner
  will practice.
- Generate as many objectives as are genuinely useful; do not artificially
  limit the number.

7. SCOPE
- Keep the project achievable within the learner's available time and
  target timeframe.
- Avoid unnecessary complexity.
- Do not add features merely to make the project appear advanced.
8. PROJECT LENGTH
- Determine an appropriate total number of challenges for this project.
- The project must contain at least 8 challenges.
- The project may contain more than 8 challenges when the project's scope
  genuinely requires additional learning stages.
- The maximum allowed is 20 challenges.
- Do not choose a larger number merely to make the project appear more advanced.
- Consider the learner's experience level, available hours per day,
  target timeframe, project complexity, and number of distinct skills that
  should be learned.
- The value represents the TOTAL number of challenges the project should
  eventually contain, including the initial 2 challenges.

Before generating the final project, consider multiple possible project
ideas internally and select the one that is most useful, practical,
distinctive, and educational for this learner.
- Do not describe the project as high-performance, production-scale,
  enterprise-grade, or highly distributed unless the learner's experience
  level and project scope genuinely justify it.

Return exactly 2 challenges and no more.
`,

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
          maxChallenges: {
            type: "integer",
            minimum: 8,
            maximum: 20
        },
          challenges: {
            type: "array",
            minItems: 2,
            maxItems: 2,
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
                  enum: ["EASY", "MEDIUM", "HARD"]
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
        required: ["title", "description","maxChallenges","challenges"]
      }
    }
  });

  const project = JSON.parse(response.text);

  const validatedProject = generatedProjectValidation.parse(project);
  return validatedProject;
};


const generateAdaptiveChallenges = async (
  learnerProfile,
  previousChallenges,
  attempts
) => {
  const SYSTEM_PROMPT = `
    You are an adaptive learning assistant that generates the next 2 coding
    challenges for a learner based on their profile and recent performance.

    Adaptation rules:
    - Analyze the learner's recent attempts, including completed and failed
      attempts, hints used, pseudocode used, and solutions requested.
    - If the learner is struggling with the current concepts, reduce the
      difficulty appropriately and reinforce those concepts.
    - If the learner consistently solves challenges independently without
      requesting hints, pseudocode, or solutions, gradually increase the difficulty.
    - Otherwise, keep the difficulty at a similar level.
    - Challenge 1 must build on the learner's most recent completed work.
    - Challenge 2 must build naturally on Challenge 1.
    - Reinforce concepts where the learner struggled while continuing to introduce
      new concepts progressively.
    - Do not unnecessarily repeat concepts the learner has already demonstrated
      successfully.
    - Never reuse or closely duplicate a previous challenge's title, description,
      premise, or primary learning objectives.
    - Stay within the learner's stated goal and project context.

    Difficulty rules:
    - EASY: simpler implementation with fewer interacting concepts.
    - MEDIUM: moderate implementation complexity involving multiple concepts.
    - HARD: significantly more complex implementation requiring stronger
      problem-solving and combining multiple concepts.
    - Difficulty must describe the actual challenge, not the fact that it was
      adaptively generated.

    Output constraints:
    - Generate exactly 2 challenges.
    - Challenge 1 must logically precede Challenge 2.
    - Each description must be 2-4 sentences, practical, and concrete.
    - Each challenge must have 2-3 concise learning objectives.
    - Do not include complete solutions or code.
    `;


  // Prevent unnecessarily large prompts.
  const recentAttempts = attempts.slice(-8);

  const previousChallengeData = previousChallenges.map((challenge) => ({
    title: challenge.title,
    description: challenge.description,
    difficulty: challenge.difficulty,
    learningObjectives: challenge.learningObjectives
  }));

  const response = await ai.models.generateContent({
    model: "gemini-3.6-flash",

    contents: `
Learner Profile:
${JSON.stringify(learnerProfile)}

Previous Challenges:
${JSON.stringify(previousChallengeData)}

Recent Attempt History:
${JSON.stringify(recentAttempts)}

Generate the next 2 challenges based on the learner's profile and
performance.
`,

    config: {
      systemInstruction: SYSTEM_PROMPT,

      responseMimeType: "application/json",

      responseSchema: {
        type: "object",

        properties: {
          challenges: {
            type: "array",
            minItems: 2,
            maxItems: 2,

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
                  enum: [
                    "EASY",
                    "MEDIUM",
                    "HARD"
                  ]
                },

                learningObjectives: {
                  type: "array",
                  minItems: 2,
                  maxItems: 3,
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

        required: ["challenges"]
      }
    }
  });

  const generatedChallenges = JSON.parse(response.text);

  const validatedChallenges =
    adaptiveChallengeValidation.parse(generatedChallenges);

  return validatedChallenges;
};

const generateEvaluation = async (challenge, solution) => {
  const response = await ai.models.generateContent({
    model: "gemini-3.6-flash",

    contents: `
You are evaluating a learner's coding solution.

Challenge:
Title: ${challenge.title}
Description: ${challenge.description}
Difficulty: ${challenge.difficulty}
Learning Objectives: ${challenge.learningObjectives.join(", ")}

Learner's solution:
${solution}

Evaluate the solution.

Rules:
1. Determine whether the logic correctly solves the challenge in general.
2. Check whether there are syntax errors.
3. Ignore syntax errors when deciding logical correctness.
4. Do not consider hardcoded answers correct if they only work for specific examples.
5. Give brief useful feedback.
`,

    config: {
      responseMimeType: "application/json",

      responseSchema: {
        type: "object",
        properties: {
          logicCorrectness: {
            type: "boolean"
          },
          syntaxCorrectness: {
            type: "boolean"
          },
          feedback: {
            type: "string"
          }
        },
        required: [
          "logicCorrectness",
          "syntaxCorrectness",
          "feedback"
        ]
      }
    }
  });

  const evaluation = JSON.parse(response.text);

  const validatedEvaluation =
    geminiEvaluationValidation.parse(evaluation);

  return validatedEvaluation;
};

const generateHint = async (challenge) => {
  const response = await ai.models.generateContent({
    model: "gemini-3.6-flash",

    contents: `
    You are a coding mentor.

    Challenge:
    Title: ${challenge.title}
    Description: ${challenge.description}
    Learning Objectives:
    ${challenge.learningObjectives.join(", ")}

    Give the learner a helpful hint.
    Do not provide the complete solution.
    Do not write the complete code.
  `,

    config: {
      responseMimeType: "application/json",

      responseSchema: {
        type: "object",
        properties: {
          hint: {
            type: "string"
          }
        },
        required: ["hint"]
      }
    }
  });
  const generatedHint = JSON.parse(response.text);

  const validatedHint = hintValidation.parse(generatedHint);
  return validatedHint;
}

const generatePseudocode = async (challenge) => {

  const response = await ai.models.generateContent({
    model: "gemini-3.6-flash",

    contents: `
      You are a coding mentor.

      Challenge:
      Title: ${challenge.title}
      Description: ${challenge.description}
      Learning Objectives:
      ${challenge.learningObjectives.join(", ")}

      Generate clear pseudocode that explains how to solve this challenge.

      Do not provide actual programming code.
      Do not skip important logical steps.
    `,

    config: {
      responseMimeType: "application/json",

      responseSchema: {
        type: "object",
        properties: {
          pseudocode: {
            type: "array",
            items: {
              type: "string"
            }
          }
        },
        required: ["pseudocode"]
      }
    }
  });

  const generatedPseudocode = JSON.parse(response.text);

  const validatedPseudocode =
    pseudocodeValidation.parse(generatedPseudocode);

  return validatedPseudocode;
};

const generateSolution = async (challenge) => {

  const response = await ai.models.generateContent({
    model: "gemini-3.6-flash",

    contents: `
      You are a coding mentor.

      Challenge:
      Title: ${challenge.title}
      Description: ${challenge.description}
      Difficulty: ${challenge.difficulty}
      Learning Objectives:
      ${challenge.learningObjectives.join(", ")}

      Provide the complete solution to this challenge.

      Include:
      1. A clear title for the solution.
      2. An explanation of the approach.
      3. The complete working code.

      Make sure the solution directly satisfies the challenge requirements.
    `,

    config: {
      responseMimeType: "application/json",

      responseSchema: {
        type: "object",
        properties: {
          title: {
            type: "string"
          },
          explanation: {
            type: "string"
          },
          code: {
            type: "string"
          }
        },
        required: [
          "title",
          "explanation",
          "code"
        ]
      }
    }
  });

  const generatedSolution = JSON.parse(response.text);

  const validatedSolution =
    solutionValidation.parse(generatedSolution);

  return validatedSolution;
};

module.exports = { generateProject, generateAdaptiveChallenges, generateEvaluation, generateHint, generatePseudocode, generateSolution }