const express = require('express')
const { authenticate } = require('../middleware/authentication.middleware')
const { createProjectController } = require('../controllers/project.controller')

const router = express.Router()

router.post('/',authenticate,createProjectController)

module.exports = router