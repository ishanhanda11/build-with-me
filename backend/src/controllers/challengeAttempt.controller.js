const { createAttemptService, getAttemptService, getAllAttemptsService, updateAttemptService } = require('../services/challengeAttempt.service')

const createAttemptController = async (req, res, next) => {
    try {
        const userId = req.user.userId
        if (!userId) {
            return res.status(401).json({
                message: 'Unauthorized'
            })
        }
        const { challengeId } = req.params
        if (!challengeId) {
            return res.status(400).json({
                message: "Challenge ID does not exist"
            });
        }
        const attempt = await createAttemptService(challengeId, userId)
        res.status(201).json({
            message: 'Attempt created successfully',
            data: attempt
        })
    } catch (err) {
        next(err)
    }
}

const getAttemptController = async (req, res, next) => {
    try {
        const userId = req.user.userId
        if (!userId) {
            return res.status(401).json({
                message: 'Unauthorized'
            })
        }
        const { attemptId } = req.params
        if (!attemptId) {
            return res.status(400).json({
                message: "Attempt ID does not exist"
            });
        }
        const attempt = await getAttemptService(attemptId, userId)
        res.status(200).json({
            message: 'Attempt fetched successfully',
            data: attempt
        })
    } catch (err) {
        next(err)
    }
}

const getAllAttemptsController = async (req, res, next) => {
    try {
        const userId = req.user.userId
        if (!userId) {
            return res.status(401).json({
                message: 'Unauthorized'
            })
        }
        const { challengeId } = req.params
        if (!challengeId) {
            return res.status(400).json({
                message: "Challenge ID does not exist"
            });
        }
        const attempts = await getAllAttemptsService(challengeId, userId)
        res.status(200).json({
            message: 'Attempts fetched successfully',
            data: attempts
        })
    } catch (err) {
        next(err)
    }
}


const updateAttemptController = async (req, res, next) => {
    try {
        const userId = req.user.userId
        if (!userId) {
            return res.status(401).json({
                message: 'Unauthorized'
            })
        }
        const { attemptId } = req.params
        if (!attemptId) {
            return res.status(400).json({
                message: "Attempt ID does not exist"
            });
        }
        const updatedAttempt = await updateAttemptService(attemptId, userId, req.body)
        res.status(200).json({
            message: 'Attempt updated successfully',
            data: updatedAttempt
        })
    } catch (err) {
        next(err)
    }
}

module.exports = {createAttemptController,getAttemptController,getAllAttemptsController,updateAttemptController}