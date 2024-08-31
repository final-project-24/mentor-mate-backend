import { check } from "express-validator";

export const skillCategoryValidationChain = [
  check('skillCategoryTitle')
    // .notEmpty()
    //   .withMessage('Skill category title is required')
    .trim()
    .isLength({min: 3, max: 100})
      .withMessage('Skill category title must be between 3 and 100 characters long'),

  check('skillCategoryDescription')
    .optional()
    .trim()
    .isLength({min: 10, max: 280})
      .withMessage('Skill category description must be between 10 and 280 characters long')
]
