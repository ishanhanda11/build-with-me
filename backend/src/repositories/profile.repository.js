const prisma = require('../db/db')

const createLearnerProfile = (profileData) => {
    return prisma.learnerProfile.create({ data: profileData })
}

const getLearnerProfileByUserId = (userId) => {
    return prisma.learnerProfile.findUnique({
        where: { userId },
        include: { user: { select: { id: true, name: true, email: true } } }
    })
}

const updateUserProfile = (id, updatedProfileData) => {
    return prisma.learnerProfile.update({ where: { id }, data: updatedProfileData })
}



module.exports = { createLearnerProfile, getLearnerProfileByUserId, updateUserProfile, }