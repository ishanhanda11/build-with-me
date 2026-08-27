const z = require('zod')

const hintValidation = z.object({
  hint: z.string().min(2)
});

const pseudocodeValidation = z.object({
  pseudocode: z.array(
    z.string().min(2)
  ).min(1)
});

const solutionValidation = z.object({
  title: z.string().min(2),
  explanation: z.string().min(2),
  code: z.string().min(1)
});

module.exports = {hintValidation,pseudocodeValidation,solutionValidation}