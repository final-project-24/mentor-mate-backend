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
      .find({isActive: true}) // find only active categories
      .skip(skip)
      .limit(limit)
      // TODO: introduce sort param instead of defaulting the sort
      // TODO: sorting introduce problems with pagination (items repeated across pages)
      // .sort({createdAt: -1})

    // pagination results
    const totalItems = await skillCategoryModel.countDocuments({isActive: true})
    const totalPages = Math.ceil(totalItems / limit)

    // response
    if (page > totalPages || categories.length === 0) {
      return res.status(400).json({error: 'Requested skill categories page exceeds the number of available pages or skill categories collection is empty'})
    } else if (categories.length > 0) {
      return res.status(200).json({
        categories,
        page,
        totalPages,
        totalItems
      })
    }
  } catch (error) {
    return res.status(500).json({error: error.message})
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

    return res.status(201).json({category})
  } catch (error) {
    return res.status(500).json({error: error.message})
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
      : res.status(404).json({error: 'Category not found'})
  } catch (error) {
    return res.status(500).json({error: error.message})
  }
}

export const deleteSkillCategory = async (req: Request, res: Response) => {
  const {id} = req.params

  try {
    // static method
    await protoSkillModel.verifySkillCategoryId(id)

    // ! hard delete
    // const deleteCategory = await skillCategoryModel.findByIdAndDelete(id)

    // return deleteCategory
    //   ? res.status(200).json({msg: 'Category deleted successfully'})
    //   : res.status(404).json({error: 'Category not found'})

    // ! soft delete
    // count the proto skills that use the category to be deleted
    const skillCount = await protoSkillModel.countDocuments({skillCategoryId: id})

    if (skillCount > 0) {
      return res.status(400).json({error: 'Cannot delete this skill category as it is already in use by one or more skills'})
    }

    // deactivate the skill category instead of deleting it
    const deactivateCategory = await skillCategoryModel.findByIdAndUpdate(
      id,
      {isActive: false}
    )

    return deactivateCategory
      ? res.status(200).json({msg: 'Category deleted successfully'})
      : res.status(404).json({error: 'Category not found'})
  } catch (error) {
    return res.status(500).json({error: error.message})
  }
}
