import { check } from "express-validator";

const enumValues = ['beginner', 'intermediate', 'advanced']

export const userSkillValidationChain = [
  check('protoSkillId')
    .if((req) => {
      return req.method.toLowerCase() !== 'patch'
    })
    .trim()
    .notEmpty()
      .withMessage('Proto skill ID is required'),

  check('proficiency')
    .trim()
    .isIn(enumValues)
      .withMessage('Invalid proficiency. Accepted values are: beginner, intermediate, advanced'),

  check('notes')
    .optional()
    .trim()
    .isLength({max: 500})
      .withMessage('Maximum notes length is 500 characters')
]
