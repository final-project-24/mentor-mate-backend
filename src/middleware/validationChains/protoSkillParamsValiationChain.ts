import { query } from "express-validator"

const enumValuesBoolean = ['true', 'false']

export const protoSkillParamsValidationChain = [
  query('allSkills')
    .trim()
    .notEmpty()
      .withMessage(`Query parameter 'allSkills' is required`)
    .isIn(enumValuesBoolean)
      .withMessage(`Invalid 'allSkills' value. Accepted values are: true, false`),

  query('categoryId')
    .optional()
    .trim()
    .notEmpty()
      .withMessage(`Query parameter 'categoryId' is required`)
]