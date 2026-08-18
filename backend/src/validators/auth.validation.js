const z = require('zod')

const registerValidation = z.object({
    name: z.string().min(3).max(50),
    email: z.string().email(),
    password: z.string().min(8)
})


const loginValidation = registerValidation.omit({ name: true });
module.exports = {
    registerValidation,
    loginValidation
}