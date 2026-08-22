const express = require('express')
const { authenticate } = require('../middleware/authentication.middleware')
const { createProjectController, getProjectsController, getProjectByIdController, updateProjectController, deleteProjectController } = require('../controllers/project.controller')
const validate = require('../middleware/validate.middleware')
const { updateProjectValidation } = require('../validators/project.validation')
const { getChallengesController,getChallengeController } = require('../controllers/challenge.controller')

const router = express.Router()

router.post('/', authenticate, createProjectController)
router.get('/', authenticate, getProjectsController)
router.get('/:id', authenticate, getProjectByIdController)
router.patch('/:id', authenticate, validate(updateProjectValidation), updateProjectController)
router.delete('/:id', authenticate, deleteProjectController)
router.get('/:projectId/challenges',authenticate,getChallengesController)
router.get('/:projectId/challenges/:id',authenticate,getChallengeController)
module.exports = router