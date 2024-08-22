import { check } from "express-validator";

export const protoSkillValidationChain = [
  check('protoSkillTitle')
    .notEmpty()
      .withMessage('Skill title is required')
    .trim()
    .isLength({min: 3, max: 100})
      .withMessage('Skill title must be between 3 and 100 characters long'),

  check('protoSkillDescription')
    .optional()
    .trim()
    // .notEmpty()
    //   .withMessage('Skill description is required')
    .isLength({max: 500})
      .withMessage('Skill description cannot be longer than 500 characters'),

  // check('protoSkillCategory')
  //   .trim()
  //   .notEmpty()
  //     .withMessage('Skill category is required')
  //   .isLength({min: 3, max: 100})
  //     .withMessage('Skill category must be between 3 and 100 characters long')
]
