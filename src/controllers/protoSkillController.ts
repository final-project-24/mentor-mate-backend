import { Request, Response } from "express"
import protoSkillModel from "../models/protoSkillModel.js"
import userSkillModel from "../models/userSkillModel.js"
import skillCategoryModel from "../models/skillCategoryModel.js"

// define interface that specifies string or array of strings type for query params
interface FilterProtoSkillsQueryParams {
  allSkills?: string
  categoryId?: string | string[]
}

export const getProtoSkills = async (req: Request, res: Response) => {
  const {allSkills, categoryId} = req.query as FilterProtoSkillsQueryParams

  // pagination params
  const page = parseInt(req.query.page as string) || 1
  const limit = parseInt(req.query.limit as string) || 10
  const skip = (page - 1) * limit

  try {
    const filter: Record<string, any> = {isActive: true}

    // if categoryId is present add it to the filter
    if (categoryId && typeof categoryId === 'string') {
      filter.skillCategoryId = categoryId
    }

    console.log('✅ getProtoSkills_finalFilterObject: ', filter)
    
    const filterKeys = Object.keys(filter)

    // prevent returning all skills when the combination of filtering criteria yields no results
    if (filterKeys[0] === 'isActive' && filterKeys.length === 1 && allSkills === 'false') {
      // return 404 with additional error message to avoid confusion
      return res.status(404).json({error: 'Skills not found'})
    }

    // protoSkill search based on pagination params
    const skills = await protoSkillModel
      .find(filter) // find only active skills
      .skip(skip)
      .limit(limit)
      .populate('skillCategoryId', 'skillCategoryTitle')
      // TODO: introduce sort param instead of defaulting the sort
      // TODO: sorting introduce problems with pagination (items repeated across pages)
      // .sort({createdAt: -1}) 

    // pagination results
    const totalItems = await protoSkillModel.countDocuments({isActive: true})
    const totalPages = Math.ceil(totalItems / limit)

    // response
    if (page > totalPages || skills.length === 0) {
      return res.status(400).json({error: 'Requested proto skills page exceeds the number of available pages or proto skills collection is empty'})
    } else if (skills.length > 0) {
      return res.status(200).json({
        skills,
        page,
        totalPages,
        totalItems
      })
    }
  } catch (error) {
    return res.status(500).json({error: error.message})
  }
}

export const createProtoSkill = async (req: Request, res: Response) => {
  const {
    protoSkillTitle,
    protoSkillDescription,
    skillCategoryId
  } = req.body

  try {
    await protoSkillModel.verifySkillCategoryId(skillCategoryId)
    await protoSkillModel.skillAlreadyExistsByTitle(protoSkillTitle)

    const category = await skillCategoryModel.findById(skillCategoryId)

    if (!category)
      throw new Error('Provided skill category ID does not match any skills')

    const skill = await protoSkillModel.create({
      protoSkillTitle,
      protoSkillDescription,
      skillCategoryId
    })

    if (skill) {
      const populatedSkill = await protoSkillModel
        .findById(skill._id)
        .populate('skillCategoryId', 'skillCategoryTitle')

      return res.status(201).json({populatedSkill})
    } else {
      return res.status(404).json({error: 'Skill not found'})
    }
  } catch (error) {
    return res.status(500).json({error: error.message})
  }
}

export const editProtoSkill = async (req: Request, res: Response) => {
  const {id} = req.params
  const data = req.body

  try {
    await protoSkillModel.verifySkillCategoryId(id)
    await protoSkillModel.validateSkillChanges(data, id)

    const updatedSkill = await protoSkillModel.findByIdAndUpdate(
      id,
      data,
      {new: true}
    )

    if (updatedSkill) {
      const populatedSkill = await protoSkillModel
        .findById(id)
        .populate('skillCategoryId', 'skillCategoryTitle')

      return res.status(200).json({populatedSkill})
    } else {
      return res.status(404).json({error: 'Skill not found'})
    }
  } catch (error) {
    return res.status(500).json({error: error.message})
  }
}

export const deleteProtoSkill = async (req: Request, res: Response) => {
  const {id} = req.params

  try {
    await protoSkillModel.verifySkillCategoryId(id)

    // ! hard delete
    // const deleteSkill = await protoSkillModel.findByIdAndDelete(id)

    // return deleteSkill
    //   ? res.status(200).json({msg: 'Skill deleted successfully'})
    //   : res.status(404).json({error: 'Skill not found'})

    // ! soft delete
    const userSkillCount = await userSkillModel.countDocuments({
      protoSkillId: id,
      isActive: true
    })

    if (userSkillCount > 0) {
      return res.status(400).json({error: 'Cannot delete skill used by one or more mentors'})
    }

    // deactivate the skill category instead of deleting it
    const deactivateSkill = await protoSkillModel.findByIdAndUpdate(
      id,
      {isActive: false}
    )

    return deactivateSkill
      ? res.status(200).json({msg: 'Skill deleted successfully'})
      : res.status(404).json({error: 'Skill not found'})
  } catch (error) {
    return res.status(500).json({error: error.message})
  }
}
