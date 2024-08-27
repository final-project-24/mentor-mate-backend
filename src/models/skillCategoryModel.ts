import { Schema, Model, model } from "mongoose";
import capitalizeFirstChar from "../utils/capitalizeFirstChar.js";

interface ISkillCategory extends Document {
  skillCategoryTitle: string
  skillCategoryTitleLower: string
  skillCategoryDescription: string
  isActive: boolean
}

interface ISkillCategoryModel extends Model<ISkillCategory> {
  skillCategoryAlreadyExistsByTitle(categoryTitle: string): Promise<void>
  validateCategoryChanges(data: object, id: string): Promise<void>
}

const skillCategorySchema = new Schema<ISkillCategory>({
  skillCategoryTitle: {
    type: String,
    required: true,
    unique: true
  },
  // this title prop is used internally in BE for comparison purposes
  skillCategoryTitleLower: {
    type: String,
    unique: true,
    select: false
  },
  skillCategoryDescription: {
    type: String
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
})

// ! static method to check for category title conflict
skillCategorySchema.statics.skillCategoryAlreadyExistsByTitle = async function (categoryTitle) {
  const categoryExists = await this.findOne({skillCategoryTitleLower: categoryTitle})

  if (categoryExists)
    throw new Error('Category with this title already exists')
}

// ! static method to validate category edit
skillCategorySchema.statics.validateCategoryChanges = async function (data, id) {
  // fetch category to modify
  const existingCategory = await this.findById(id)

  if (!existingCategory)
    throw new Error('Provided category ID does not match any category')

  // check for other categories with the same title
  const categoryExistsByTitle = await this.findOne({skillCategoryTitleLower: data.skillCategoryTitle.toLowerCase()})

  if (categoryExistsByTitle)
    throw new Error('Category with this title already exists')

  // check if updated category differs from original category
  const isDifferent = Object.keys(data).some(key => existingCategory[key] !== data[key])

  if (!isDifferent)
    throw new Error('No category changes were detected')
}

// ! pre hook
skillCategorySchema.pre<ISkillCategory>('save', function (next) {
  this.skillCategoryTitle = capitalizeFirstChar(this.skillCategoryTitle)
  this.skillCategoryTitleLower = this.skillCategoryTitle.toLowerCase()
  
  if (this.skillCategoryDescription)
    this.skillCategoryDescription = capitalizeFirstChar(this.skillCategoryDescription)

  next()
})

// ! set hook
// excludes skillCategoryTitleLower prop from response object when using .json() method
skillCategorySchema.set('toJSON', {
  transform: function (_, ret) {
    delete ret.skillCategoryTitleLower
    delete ret.isActive
    return ret
  }
})

const skillCategoryModel = model<ISkillCategory, ISkillCategoryModel>('skill_category', skillCategorySchema)

export default skillCategoryModel
