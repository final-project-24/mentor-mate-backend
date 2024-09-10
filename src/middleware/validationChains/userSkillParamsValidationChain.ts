import { query } from "express-validator"

const enumValuesBoolean = ['true', 'false']
const enumValuesProficiency = ['beginner', 'intermediate', 'advanced']

export const userSkillParamsValidationChain = [
  query('isMentor')
    .trim()
    .notEmpty()
      .withMessage(`Query parameter 'isMentor' is required`)
    .isIn(enumValuesBoolean)
      .withMessage(`Invalid 'isMentor' value. Accepted values are: true, false`),

  query('allSkills')
    .trim()
    .notEmpty()
      .withMessage(`Query parameter 'allSkills' is required`)
    .isIn(enumValuesBoolean)
      .withMessage(`Invalid 'allSkills' value. Accepted values are: true, false`),

  query('userName')
    .optional()
    .trim()
    .notEmpty()
      .withMessage(`Query parameter 'userName' cannot be empty`),

  query('skillTitle')
    .optional()
    .trim()
    .notEmpty()
      .withMessage(`Query parameter 'skillTitle' cannot be empty`),
  
  query('skillCategoryTitle')
    .optional()
    .trim()
    .notEmpty()
      .withMessage(`Query parameter 'skillCategoryTitle' cannot be empty`),

  query('proficiency')
    .optional()
    .trim()
    .isIn(enumValuesProficiency)
      .withMessage('Invalid proficiency. Accepted values are: beginner, intermediate, advanced')
]
