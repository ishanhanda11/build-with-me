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

const getProfile = async (userId) =>{
    const profile = await getLearnerProfileByUserId(userId)
    if(!profile){
        const err = new Error('profile does not exist.')
        err.statusCode = 404
        throw err
    }
    return {
        message: "profile fetched successfully",
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

}

const updateProfile = async (userId, data) =>{
    const existingProfile = await getLearnerProfileByUserId(userId)
    if (!existingProfile){
        const err = new Error('profile does not exist.')
        err.statusCode = 404
        throw err
    }
    const updatedProfile = await updateUserProfile(existingProfile.id,data)
    return {
        message: "profile has been updated successfully.",
        profile: {
        id: updatedProfile.id,
        goal: updatedProfile.goal,
        targetTimeFrame: updatedProfile.targetTimeFrame,
        experienceLevel: updatedProfile.experienceLevel,
        difficulty: updatedProfile.difficulty,
        helpPreference: updatedProfile.helpPreference,
        learningStyle: updatedProfile.learningStyle,
        availableHoursPerDay: updatedProfile.availableHoursPerDay
    }

    }

}
module.exports = {createProfile, getProfile, updateProfile}

