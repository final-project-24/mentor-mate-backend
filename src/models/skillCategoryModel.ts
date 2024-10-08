import { Schema, Model, model, Query } from "mongoose";
import capitalizeFirstChar from "../utils/capitalizeFirstChar.js";

// extend Document with ISkillCategory
interface ISkillCategory extends Document {
  skillCategoryTitle: string
  skillCategoryTitleLower: string
  skillCategoryDescription: string
  isActive: boolean
}

// extend Query with ISkillCategoryQuery and ISkillCategory
interface ISkillCategoryQuery extends Query<any, ISkillCategory> {
  _update: Partial<ISkillCategory>
}

// extend Model with ISkillCategoryModel
interface ISkillCategoryModel extends Model<ISkillCategory> {
  skillCategoryAlreadyExistsByTitle(categoryTitle: string): Promise<void>
  validateCategoryChanges(data: object, id: string): Promise<void>
}

const skillCategorySchema = new Schema<ISkillCategory>({
  skillCategoryTitle: {
    type: String,
    required: true,
    // unique: true
  },
  // this title field is used internally in BE for comparison purposes
  skillCategoryTitleLower: {
    type: String,
    // unique: true
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

// ! index method (has to be placed right after schema definition)
// restrict index on database level to allow only one proficiency enum value per prototypeSkill and mentor
skillCategorySchema.index(
  {
    skillCategoryTitle: 1,
    skillCategoryTitleLower: 1
  },
  { 
    unique: true,
    partialFilterExpression: {isActive: true} // TODO: index only when isActive is true, this will prevent a situation when new userSkill based on the same proto skills has the same proficiency as the equivalent inactive userSkill resulting in error 11000
  }
)

// ! static method to check for category title conflict
skillCategorySchema.statics.skillCategoryAlreadyExistsByTitle = async function (categoryTitle) {
  const categoryExists = await this.findOne({
    skillCategoryTitleLower: categoryTitle,
    isActive: true
  })

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
  const categoryExistsByTitle = await this.findOne({
    skillCategoryTitleLower: data.skillCategoryTitle.toLowerCase(),
    _id: {$ne: id},
    isActive: true // $ne selector (not equal) excludes the documents which _id is equal to id
  })

  if (categoryExistsByTitle)
    throw new Error('Category with this title already exists')

  // check if updated category differs from original category
  const isDifferent = Object.keys(data).some(key => existingCategory[key] !== data[key])

  if (!isDifferent)
    throw new Error('No category changes were detected')
}

// ! pre hooks
// 'save' pre hook
skillCategorySchema.pre<ISkillCategory>('save', function (next) {
  this.skillCategoryTitle = capitalizeFirstChar(this.skillCategoryTitle)
  this.skillCategoryTitleLower = this.skillCategoryTitle.toLowerCase()
  
  if (this.skillCategoryDescription)
    this.skillCategoryDescription = capitalizeFirstChar(this.skillCategoryDescription)

  next()
})

// * 'findOneAndUpdate' pre hook
// _update object holds key value pairs for the object specified in 'findOnceAndUpdate' query
// in the controller, the method: 'findByIdAndUpdate' is used. This method is build on top of 'findOneAndUpdate' therefore it triggers this hook
skillCategorySchema.pre<ISkillCategoryQuery>('findOneAndUpdate', function (next) {
  if (this._update.skillCategoryTitle) {
    this._update.skillCategoryTitle = capitalizeFirstChar(this._update.skillCategoryTitle)
    this._update.skillCategoryTitleLower = this._update.skillCategoryTitle.toLowerCase()
  }

  if (this._update.skillCategoryDescription && this._update.skillCategoryDescription.length > 0) {
    this._update.skillCategoryDescription = capitalizeFirstChar(this._update.skillCategoryDescription)
  }

  next()
})

// ! set hook
// excludes model props from response object when using .json() method
skillCategorySchema.set('toJSON', {
  transform: function (_, ret) {
    delete ret.skillCategoryTitleLower
    delete ret.isActive
    return ret
  }
})

const skillCategoryModel = model<ISkillCategory, ISkillCategoryModel>('skill_category', skillCategorySchema)

export default skillCategoryModel
