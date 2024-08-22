import { Request, Response } from "express"
import skillCategoryModel from "../models/skillCategoryModel.js"
import protoSkillModel from "../models/protoSkillModel.js"

export const getSkillCategories = async (req: Request, res: Response) => {
  // pagination params
  const page = parseInt(req.query.page as string) || 1
  const limit = parseInt(req.query.limit as string) || 10
  const skip = (page - 1) * limit
  
  try {
    // skillCategory search based on pagination params
    const categories = await skillCategoryModel
      .find()
      .skip(skip)
      .limit(limit)
      .sort({createdAt: -1}) // TODO: introduce sort param instead of defaulting the sort

    // pagination results
    const totalItems = await skillCategoryModel.countDocuments()
    const totalPages = Math.ceil(totalItems / limit)

    // response
    if (page > totalPages && categories.length > 0) {
      res.status(400).json({msg: `Requested skill category page exceeds the number of available pages`})
    } else if (categories.length === 0) {
      res.status(200).json({msg: 'Skill category collection is empty'})
    } else if (categories.length > 0) {
      res.status(200).json({
        categories,
        page,
        totalPages: totalPages,
        totalItems: totalItems
      })
    }
  } catch (error) {
    res.status(500).json({error: error.message})
  }
}

export const createSkillCategory = async (req: Request, res: Response) => {
  const {
    skillCategoryTitle,
    skillCategoryDescription
  } = req.body

  try {
    // static method
    await skillCategoryModel.skillCategoryAlreadyExistsByTitle(skillCategoryTitle)

    const category = await skillCategoryModel.create({
      skillCategoryTitle,
      skillCategoryDescription
    })

    res.status(201).json({category})
  } catch (error) {
    res.status(500).json({error: error.message})
  }
}

export const editSkillCategory = async (req: Request, res: Response) => {
  const {id} = req.params
  const data = req.body

  try {
    // static method
    await protoSkillModel.verifySkillCategoryId(id)
    await skillCategoryModel.validateCategoryChanges(data, id)

    const updatedCategory = await skillCategoryModel.findByIdAndUpdate(
      id,
      data,
      {new: true}
    )

    return updatedCategory
      ? res.status(200).json({updatedCategory})
      : res.status(404).json({msg: 'Category not found'})
  } catch (error) {
    res.status(500).json({error: error.message})
  }
}

export const deleteSkillCategory = async (req: Request, res: Response) => {
  const {id} = req.params

  try {
    // static method
    await protoSkillModel.verifySkillCategoryId(id)

    const deleteCategory = await skillCategoryModel.findByIdAndDelete(id)

    return deleteCategory
      ? res.status(200).json({msg: 'Category deleted successfully'})
      : res.status(404).json({msg: 'Category not found'})
  } catch (error) {
    res.status(500).json({error: error.message})
  }
}
