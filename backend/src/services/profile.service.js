const {createLearnerProfile,getLearnerProfileByUserId,updateUserProfile} = require('../repositories/profile.repository')
const prisma = require('../db/db')

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
    const user = await prisma.user.findUnique({ where: { id: userId }, select: { name: true, email: true } })
    return {
        message: "profile created successfully",
        profile: {
            id: profile.id,
            name: user?.name || "Builder",
            email: user?.email || "",
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
    let userName = profile.user?.name;
    let userEmail = profile.user?.email;
    if (!userName) {
        const u = await prisma.user.findUnique({ where: { id: userId }, select: { name: true, email: true } });
        userName = u?.name;
        userEmail = u?.email;
    }
    return {
        message: "profile fetched successfully",
        profile: {
            id: profile.id,
            name: userName || "Builder",
            email: userEmail || "",
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
    const { id, name, email, user, ...cleanData } = data;
    const updatedProfile = await updateUserProfile(existingProfile.id, cleanData)
    return {
        message: "profile has been updated successfully.",
        profile: {
            id: updatedProfile.id,
            name: existingProfile.user?.name || "Developer",
            email: existingProfile.user?.email || "",
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

