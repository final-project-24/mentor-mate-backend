import { Request, Response } from "express"
import protoSkillModel from "../models/protoSkillModel.js"

export const getProtoSkills = async (req: Request, res: Response) => {
  // pagination params
  const page = parseInt(req.query.page as string) || 1
  const limit = parseInt(req.query.limit as string) || 10
  const skip = (page - 1) * limit

  try {
    // protoSkill search based on pagination params
    const skills = await protoSkillModel
      .find()
      .skip(skip)
      .limit(limit)
      .populate('skillCategoryId', 'skillCategoryTitle')
      .sort({createdAt: -1}) // TODO: introduce sort param instead of defaulting the sort

    // pagination results
    const totalItems = await protoSkillModel.countDocuments()
    const totalPages = Math.ceil(totalItems / limit)

    // response
    if (page > totalPages && skills.length > 0) {
      res.status(400).json({msg: `Requested skills page exceeds the number of available pages`})
    } else if (skills.length === 0) {
      res.status(200).json({msg: 'Skills collection is empty'})
    } else if (skills.length > 0) {
      res.status(200).json({
        skills,
        page,
        totalPages: totalPages,
        totalItems: totalItems
      })
    }
  } catch (error) {
    res.status(500).json({error: error.message})
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

    const skill = await protoSkillModel.create({
      protoSkillTitle,
      protoSkillDescription,
      skillCategoryId
    })
  
    res.status(201).json({skill})
  } catch (error) {
    res.status(500).json({error: error.message})
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

    updatedSkill
      ? res.status(200).json({updatedSkill})
      : res.status(404).json({msg: 'Skill not found'})
  } catch (error) {
    res.status(500).json({error: error.message})
  }
}

export const deleteProtoSkill = async (req: Request, res: Response) => {
  const {id} = req.params

  try {
    await protoSkillModel.verifySkillCategoryId(id)

    const deleteSkill = await protoSkillModel.findByIdAndDelete(id)

    return deleteSkill
      ? res.status(200).json({msg: 'Skill deleted successfully'})
      : res.status(404).json({msg: 'Skill not found'})
  } catch (error) {
    res.status(500).json({error: error.message})
  }
}
