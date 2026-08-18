const {createLearnerProfile,getLearnerProfileByUserId,updateUserProfile} = require('../repositories/profile.repository')

const createProfile = async (
  {
    goal,
    targetTimeFrame,
    experienceLevel,
    difficulty,
    helpPreference,
    learningStyle,
    availableHoursPerDay
  },
  userId
) => {
   
    const existingProfile = await getLearnerProfileByUserId(userId)
    if(existingProfile){
        const err = new Error("Profile already exists");
        err.statusCode = 409;
        throw err;
    }
    const profileData = {
        goal,
        userId,
        targetTimeFrame,
        experienceLevel,
        difficulty,
        helpPreference,
        learningStyle,
        availableHoursPerDay
    }
    const profile = await createLearnerProfile(profileData)
    return {
        message: "profile created successfully",
        profile: {
        id: profile.id,
        goal: profile.goal,
        targetTimeFrame: profile.targetTimeFrame,
        experienceLevel: profile.experienceLevel,
        difficulty: profile.difficulty,
        helpPreference: profile.helpPreference,
        learningStyle: profile.learningStyle,
        availableHoursPerDay: profile.availableHoursPerDay
    }
    }

};

module.exports = {createProfile}

