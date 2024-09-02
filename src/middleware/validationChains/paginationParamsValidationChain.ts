import { query } from "express-validator";

export const paginationParamsValidationChain = [
  query('page')
    .trim()
    .isInt({min: 1})
    .withMessage(`Query parameter 'Page' must be greater than 0`),
  
  query('limit')
    .trim()
    .isInt({min: 1, max: 50})
    .withMessage(`Query parameter 'Limit' must be between 1 and 50`)
]
