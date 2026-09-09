const z = require('zod')

const registerValidation = z.object({
    name: z
        .string({ required_error: "Name is required" })
        .trim()
        .min(3, "Name must be at least 3 characters long")
        .max(50, "Name cannot exceed 50 characters"),

    email: z
        .string({ required_error: "Email is required" })
        .trim()
        .email("Please enter a valid email address"),

    password: z
        .string({ required_error: "Password is required" })
        .min(8, "Password must be at least 8 characters long")
})

const loginValidation = registerValidation.omit({ name: true });

module.exports = {
    registerValidation,
    loginValidation
}
