
const prisma = require('../db/db')
const getUser = (userId) => {
  return prisma.user.findUnique({
    where: { id: userId },
    select: { id: true, name: true, email: true }
  })
}

const findUserByEmail = async (email) => {
  return prisma.user.findUnique({
    where: {
      email,
    },
  });
}


const createUser = async (userData) => {
  return prisma.user.create({ data: userData })
}

const findRefreshToken = async (tokenHash) => {
  return prisma.refreshToken.findFirst({ where: { tokenHash } })
}
const revokeRefreshToken = async (id, tx = prisma) => {
  return tx.refreshToken.update({
    where: {
      id
    },
    data: {
      revokedAt: new Date()
    }
  });
};


const createRefreshToken = async (refreshTokenData, tx = prisma,) => {
  return tx.refreshToken.create({
    data: refreshTokenData
  });
};



module.exports = {
  getUser, findUserByEmail, createUser, findRefreshToken, createRefreshToken, revokeRefreshToken
}