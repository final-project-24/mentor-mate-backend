import { Request, Response } from "express"
import userSkillModel from "../models/userSkillModel.js"
import userModel from "../models/userModel.js"
import protoSkillModel from "../models/protoSkillModel.js"
import skillCategoryModel from "../models/skillCategoryModel.js"
import syncIndexesIfNodeEnvDev from "../utils/syncIndexesIfNodeEnvDev.js"
import checkIfMongoId from "../utils/checkIfMongoId.js"
import mongoose from "mongoose"

// define interface that specifies sting or array of strings type for query params
// TODO: adjust the filtering logic to accept arrays of strings
interface FilterUserSkillsQueryParams {
  allSkills?: string
  isMentor?: string
  userName?: string | string[]           
  skillTitle?: string | string[]        
  skillCategoryTitle?: string | string[] 
  proficiency?: string | string[]                   
  // rating?: number[] // TODO: rating is not referenced in user skills therefore skills cannot be filtered by rating     
}

export const getUserSkills = async (req: Request, res: Response) => {
  const {
    allSkills,
    isMentor,
    // userName,
    skillTitle,
    skillCategoryTitle,
    proficiency,
  } = req.query as FilterUserSkillsQueryParams

  const {userId} = req
  // pagination params
  const page = parseInt(req.query.page as string) || 1
  const limit = parseInt(req.query.limit as string) || 10
  const skip = (page - 1) * limit

  try {
    const filter: Record<string, any> = {isActive: true}

    // isMentor param is used to get skills by user id (this could be helpful when searching for skills while logged in as a mentor)
    if (isMentor === 'true') {
      if (checkIfMongoId(userId)) {
        filter.mentorId = userId // add mentorId to the filter
      } else {
        return res.status(400).json('Something went wrong')
      }
    }

    // define an array of protoSkillIds to use in the final filter
    // specify array elements types to be mongoose ObjectIds
    let protoSkillIds: mongoose.Types.ObjectId[] = []

    if (skillCategoryTitle && typeof skillCategoryTitle === 'string') {
      // skillCategory search will always return an array with one element because skillCategoryTitle is unique
      const skillCategory = await skillCategoryModel
        .find({skillCategoryTitleLower: skillCategoryTitle.toLowerCase()})
        .select('_id')

      if (skillCategory.length > 0) {
        const protoSkills = await protoSkillModel
          .find({skillCategoryId: skillCategory[0]._id})
          .select('_id')

        if (protoSkills.length > 0) {
          // update protoSkillsIds array with found protoSkillIds
          protoSkillIds = protoSkills.map(p => p._id)
        } else {
          return res.status(404).json({error: 'Error finding proto skills by skillCategoryId'})
        }
      } else {
        return res.status(404).json({error: `Skill category: ${skillCategoryTitle} not found`})
      }
    }

    if (skillTitle && typeof skillTitle === 'string') {
      // protoSkill search will always return an array with one element because protoSkillTitle is unique
      const protoSkill = await protoSkillModel
        .find({protoSkillTitleLower: skillTitle.toLowerCase()})
        .select('_id')

      if (protoSkill.length > 0) {
        // merge protoSkillIds with those found by skillTitle
        protoSkillIds = protoSkillIds.length > 0
          // the .equals() is a mongoose method used to compare mongoose ObjectIds
          // the protoSkillIds array was configured to work with this data type
          // the .some() method will return true for any array element that meets equality test and the .filter() method will return a new array with those elements
          ? protoSkillIds.filter(id => protoSkill.some(p => p._id.equals(id)))
          : protoSkill.map(p => p._id)
      } else {
        return res.status(404).json({error: `Skill ${skillTitle} not found`})
      }
    }

    // add 'protoSkillId: { $in: protoSkillIds }' as the key value pair to the filter
    // the $in operator will cause the .find() mongoose method to find all the skills where the value of the field protoSkillId matches ObjectIds in the protoSkillIds array
    if (protoSkillIds.length > 0) {
      filter.protoSkillId = {$in: protoSkillIds}
    }

    // add proficiency to the filter
    if (proficiency && typeof proficiency === 'string') {
      filter.proficiency = proficiency
    }

    console.log('✅ getUserSkills_finalFilterObject: ', filter)
    
    const filterKeys = Object.keys(filter)

    // prevent returning all skills when the combination of filtering criteria yields no results
    if (filterKeys[0] === 'isActive' && filterKeys.length === 1 && allSkills === 'false') {
      // return 404 with additional error message to avoid confusion
      return res.status(404).json({error: 'Skills not found'})
    }

    // run the final query using the final shape of the filter object
    const skills = await userSkillModel
      .find(filter)
      // pagination
      .skip(skip)
      .limit(limit)
      // populate
      .populate({
        path: 'protoSkillId',
        populate: {path: 'skillCategoryId'}
      })
      .populate({
        path: 'mentorUuid',
        model: 'User',
        localField: 'mentorUuid',    // the field in userSkill schema
        foreignField: 'uuid',        // the field in User schema
        select: 'uuid userName -_id' // adjust selection as needed (minus prefix excludes fields)
      })

    // pagination results
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
