import { Request, Response } from "express"
import userSkillModel from "../models/userSkillModel.js"
import userModel from "../models/userModel.js"
import protoSkillModel from "../models/protoSkillModel.js"
import syncIndexesIfNodeEnvDev from "../utils/syncIndexesIfNodeEnvDev.js"

export const getUserSkills = async (req: Request, res: Response) => {
  // pagination params
  const page = parseInt(req.query.page as string) || 1
  const limit = parseInt(req.query.limit as string) || 10
  const skip = (page - 1) * limit

  try {
    // userSkill search based on pagination params
    const skills = await userSkillModel
    .find({isActive: true})
    .skip(skip)
    .limit(limit)
    .populate({
      path: 'protoSkillId',
      populate: {
        path: 'skillCategoryId'
      }
    })
    .populate({
      path: 'mentorUuid',
      model: 'User',
      localField: 'mentorUuid',     // the field in userSkill schema
      foreignField: 'uuid',         // the field in User schema
      select: 'uuid userName -_id'  // adjust selection as needed (minus prefix excludes fields)
    })  
    .sort({createdAt: -1}) // TODO: introduce sort param instead of defaulting the sort

    // pagination results
    const totalItems = await userSkillModel.countDocuments()
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

export const getMentorSkills = async (req: Request, res: Response) => {
  const {userId} = req

  // pagination params
  const page = parseInt(req.query.page as string) || 1
  const limit = parseInt(req.query.limit as string) || 10
  const skip = (page - 1) * limit

  try {
    // userSkill search based on pagination params
    const skills = await userSkillModel
    .find(
      {
        mentorId: userId,
        isActive: true
      }
    )
    .skip(skip)
    .limit(limit)
    .populate({
      path: 'protoSkillId',
      populate: {
        path: 'skillCategoryId'
      }
    })
    .populate({
      path: 'mentorUuid',
      model: 'User',
      localField: 'mentorUuid',     // the field in userSkill schema
      foreignField: 'uuid',         // the field in User schema
      select: 'uuid userName -_id'  // adjust selection as needed (minus prefix excludes fields)
    })  
    .sort({createdAt: -1}) // TODO: introduce sort param instead of defaulting the sort

    console.log(skills)

    // pagination results
    const totalItems = await userSkillModel.countDocuments()
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

export const createUserSkill = async (req: Request, res: Response) => {
  const {userId} = req
  const {
    protoSkillId,
    proficiency,
    notes
  } = req.body

  try {
    // sync indexes in case user_skills collection was dropped
    syncIndexesIfNodeEnvDev()

    // static method
    await userSkillModel.verifyUserSkillId(userId, protoSkillId)

    // check if mentor exist and extract uuid
    const {uuid: mentorUuid} = await userModel.findById(userId).select('uuid')

    if (!mentorUuid)
      throw new Error('Mentor not found')

    // check if proto skill exist
    const protoSkill = await protoSkillModel.findById(protoSkillId)

    if (!protoSkill)
      throw new Error('Provided proto skill ID does not match any proto skills')
    
    const skill = await userSkillModel.create({
      mentorId: userId,
      mentorUuid,
      protoSkillId,
      proficiency,
      notes
    })

    if (skill) {
      const populatedSkill = await userSkillModel
        .findById(skill._id)
        .populate({
          path: 'protoSkillId',
          populate: {
            path: 'skillCategoryId'
          }
        })
        .populate({
          path: 'mentorUuid',
          model: 'User',
          localField: 'mentorUuid',
          foreignField: 'uuid',
          select: 'uuid userName -_id'
        })

      res.status(201).json({populatedSkill})
    } else {
      res.status(404).json({msg: 'Skill not found'})
    }
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({error: 'A skill with this proficiency already exists'})
    }

    res.status(500).json({error: error.message})
  }
}

export const editUserSkill = async (req: Request, res: Response) => {
  const {id} = req.params
  const data = req.body

  try {
    // sync indexes in case user_skills collection was dropped
    syncIndexesIfNodeEnvDev()

    // static method
    await userSkillModel.verifyUserSkillId(id)
    await userSkillModel.validateSkillChanges(data, id)

    const updateSkill = await userSkillModel.findByIdAndUpdate(
      id,
      data,
      {new: true}
    )

    if (updateSkill) {
      const populatedSkill = await userSkillModel
        .findById(id)
        .populate({
          path: 'protoSkillId',
          populate: {
            path: 'skillCategoryId'
          }
        })
        .populate({
          path: 'mentorUuid',
          model: 'User',
          localField: 'mentorUuid',
          foreignField: 'uuid',
          select: 'uuid userName -_id'
        })

      res.status(200).json({populatedSkill})
    } else {
      res.status(404).json({msg: 'Skill not found'})
    }
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({error: 'A skill with this proficiency already exists'})
    }

    res.status(500).json({error: error.message})
  }
}

export const deleteUserSkill = async (req: Request, res: Response) => {
  const {id} = req.params

  try {
    await userSkillModel.verifyUserSkillId(id)

    // ! soft delete
    const deactivateSkill = await userSkillModel.findByIdAndUpdate(
      id,
      {isActive: false}
    )

    return deactivateSkill
      ? res.status(200).json({msg: 'Skill deleted successfully'})
      : res.status(404).json({msg: 'Skill not found'})
  } catch (error) {
    res.status(500).json({error: error.message})
  }
}
