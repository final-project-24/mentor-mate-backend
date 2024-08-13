import mongoose from "mongoose";
import userModel from "../models/userModel.js";
import skillModel from '../models/skillModel.js';

// get skills

const getSkills = async (req, res) => {
  try {
    const skills = await skillModel.find()
    console.log(skills)
    res.status(200).json({skills: skills})
  } catch (error) {
    res.status(400).json({message: error})
  }
}

// create skill

const createSkill = async (req, res) => {
  const { name, level, yearsOfExperience } = req.body;

  const newSkill = new skillModel({
    name,
    level,
    yearsOfExperience,
  });

  try {
    await newSkill.save();
    res.status(201).json({newSkill: newSkill});
  } catch (error) {
    res.status(400).json({message: error});
  }
}

// delete skill

const deleteSkill = async (req, res) => {
  const { skillId } = req.body

  try {
    await skillModel.findByIdAndDelete(skillId)
    res.status(200).json({message: `Skill with ID: ${skillId} deleted successfully!`})
  } catch (error) {
    res.status(400).json({message: error})
  }
}

// add skill to user

const addSkillToUser = async (req, res) => {
  const { userId, skillId } = req.body

  try {
    const user = await userModel.findById(userId)
    if (!user) {
      return res.status(404).json({message: 'User not found.'})
    }

    user.skills.push(new mongoose.Types.ObjectId(skillId))
    await user.save()

    res.status(200).json({user: user})
  } catch (error) {
    res.status(400).json({message: error})
  }
}

export {
  createSkill,
  deleteSkill,
  addSkillToUser,
  getSkills
}
