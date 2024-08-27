import { check } from "express-validator";

const enumValues = ['beginner', 'intermediate', 'advanced']

export const userSkillValidationChain = [
  check('protoSkillId')
    .if((req) => {
      return req.method.toLowerCase() !== 'patch'
    })
    .notEmpty()
      .withMessage('Proto skill ID is required'),

  check('proficiency')
    .notEmpty()
      .withMessage('Proficiency is required')
    .isIn(enumValues)
      .withMessage('Invalid proficiency. Accepted values are: beginner, intermediate, advanced'),

  check('notes')
    .optional()
    .isLength({max: 500})
      .withMessage('Maximum notes length is 500 characters')
]
