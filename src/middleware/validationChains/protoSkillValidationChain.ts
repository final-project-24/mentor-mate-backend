import { check } from "express-validator";

export const protoSkillValidationChain = [
  check('skillCategoryId')
    .notEmpty()
      .withMessage('Skill category ID is required'),

  check('protoSkillTitle')
    .notEmpty()
      .withMessage('Skill title is required')
    .trim()
    .isLength({min: 3, max: 100})
      .withMessage('Skill title must be between 3 and 100 characters long'),

  check('protoSkillDescription')
    .optional()
    .trim()
    .isLength({max: 500})
      .withMessage('Skill description cannot be longer than 500 characters'),
]
