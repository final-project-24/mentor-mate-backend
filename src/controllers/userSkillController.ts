import { Request, Response } from "express"
import userSkillModel from "../models/userSkillModel.js"
import userModel from "../models/userModel.js"
import protoSkillModel from "../models/protoSkillModel.js"
import skillCategoryModel from "../models/skillCategoryModel.js"
import syncIndexesIfNodeEnvDev from "../utils/syncIndexesIfNodeEnvDev.js"
import checkIfMongoId from "../utils/checkIfMongoId.js"

// define interface that accept multiple types to lay ground for multiple category groups per filtering search
interface FilterUserSkillsQueryParams {
  isMentor?: string
  userName?: string | string[]           
  skillTitle?: string | string[]        
  skillCategoryTitle?: string | string[] 
  proficiency?: string | string[]                   
  // rating?: number[] // TODO: rating is not referenced in user skills therefore skills cannot be filtered by rating     
}

export const getUserSkills = async (req: Request, res: Response) => {
  // query params
  const {
    isMentor,
    userName, // userNameLower => userSkillModel
    skillTitle, // protoSkillTitleLower => protoSkillModel
    skillCategoryTitle, // skillCategoryTitleLower => skillCategoryModel
    proficiency, // proficiency => userSkillModel
    // rating // rating => feedbackModel
  } = req.query as FilterUserSkillsQueryParams

  // userId
  const {userId} = req

  // pagination params
  const page = parseInt(req.query.page as string) || 1
  const limit = parseInt(req.query.limit as string) || 10
  const skip = (page - 1) * limit

  /*
  ** FILTERS
  */

  // ! initialize filter with isActive prop to return only active skills
  // the filter object will be updated with other props depending on used filter combination
  const filter: Record<string, any> = {isActive: true}

  // ! filter by mentor ID (user ID)
  if (isMentor === 'true') {
    if (checkIfMongoId(userId)) {
      filter.mentorId = userId
    } else {
      // return generic error to avoid exposing any association with user ID
      return res.status(400).json('Something went wrong')
    }
  }

  // ! filter by mentor username
  if (userName && typeof userName === 'string') {
    // fetch users IDs by username
    const users = await userModel
      .find({userNameLower: userName.toLowerCase()})
      .select('_id')

    if (users.length > 0) {
      // extract user IDs
      const userIds = users.map(u => u._id)

      console.log('✅ userIds: ', userIds)
      
      // update the filter object
      filter.mentorId = userIds
    } else {
      return res.status(404).json({error: `Skills linked to mentor: ${userName} not found`})
    }
  }

  // ! filter by skillCategory
  if (skillCategoryTitle && typeof skillCategoryTitle === 'string') {
    // fetch skill category ID by skillCategory
    // the returned array will always have 1 object because skillCategoryTitle is unique
    const skillCategory = await skillCategoryModel
      .find({skillCategoryTitleLower: skillCategoryTitle.toLowerCase()})
      .select('_id')

    if (skillCategory.length > 0) {
      // fetch proto skills IDs by skillCategoryId
      const protoSkills = await protoSkillModel
        .find({skillCategoryId: skillCategory[0]._id})
        .select('_id')

      if (protoSkills.length > 0) {
        // extract proto skills IDs
        const protoSkillIds = protoSkills.map(p => p._id)

        console.log('✅ protoSkillId in filter skillCategory: ', protoSkillIds)

        // update the filter object
        filter.protoSkillId = protoSkillIds
      } else {
        return res.status(404).json({error: 'Error finding proto skills by skillCategoryId'})
      }
    } else {
      return res.status(404).json({error: `Skill category: ${skillCategory} not found`})
    }
  }

  // ! filter by skill title
  if (skillTitle && typeof skillTitle === 'string') {
    // fetch proto skill ID by skillTitle
    // the returned array will always have 1 object because protoSkillTitle is unique
    const protoSkill = await protoSkillModel
      .find({protoSkillTitleLower: skillTitle.toLowerCase()})
      .select('_id')

    if (protoSkill.length > 0) {
      // extract proto skill ID
      const protoSkillId = [protoSkill[0]._id]

      console.log('✅ protoSkillId in filter skillTitle: ', protoSkillId)

      // update the filter object
      filter.protoSkillId = protoSkillId
    } else {
      return res.status(404).json({error: `Skill ${skillTitle} not found`})
    }
  }

  // ! filter by proficiency
  if (proficiency && typeof proficiency === 'string') {

    console.log('✅ proficiency: ', proficiency)

    // update filter object
    filter.proficiency = proficiency
  }

  console.log('✅ filter: ', filter)

  /*
  ** RETURN RESULTS
  */

  try {
    const skills = await userSkillModel
      .find(filter)
      // pagination
      .skip(skip)
      .limit(limit)
      // populate
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

    const totalItems = await userSkillModel.countDocuments(filter)
    const totalPages = Math.ceil(totalItems / limit)

    if (page > totalPages || skills.length === 0) {
      return res.status(400).json({error: 'Requested user skills page exceeds the number of available pages or user skills collection is empty'})
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

      return res.status(201).json({populatedSkill})
    } else {
      return res.status(404).json({error: 'Skill not found'})
    }
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({error: 'A skill with this proficiency already exists'})
    }

    return res.status(500).json({error: error.message})
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

      return res.status(200).json({populatedSkill})
    } else {
      return res.status(404).json({error: 'Skill not found'})
    }
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({error: 'A skill with this proficiency already exists'})
    }

    return res.status(500).json({error: error.message})
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
      : res.status(404).json({error: 'Skill not found'})
  } catch (error) {
    return res.status(500).json({error: error.message})
  }
}

