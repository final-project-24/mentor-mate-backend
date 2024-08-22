import { Document, Schema, Model, model } from "mongoose";
import capitalizeFirstChar from "../utils/capitalizeFirstChar.js";
import checkIfMongoId from "../utils/checkIfMongoId.js";

interface IProtoSkill extends Document {
  protoSkillTitle: string
  protoSkillTitleLower: string
  // protoSkillProficiency: string
  protoSkillDescription: string
  skillCategoryId: Schema.Types.ObjectId
}

interface IProtoSkillModel extends Model<IProtoSkill> {
  verifySkillCategoryId(...ids: string[]): Promise<void>
  skillAlreadyExistsByTitle(skillTitle: any): Promise<void>
  validateSkillChanges(data: object, id: string): Promise<void>
}

const protoSkillSchema = new Schema<IProtoSkill>({
  protoSkillTitle : {
    type: String,
    required: true,
    unique: true
  },
  // this title prop is used internally in BE for comparison purposes
  protoSkillTitleLower: {
    type: String,
    unique: true,
    // select: false
  },
  // protoSkillProficiency: {
  //   type: String,
  //   enum: ['beginner', 'intermediate', 'advanced']
  // },
  protoSkillDescription: {
    type: String,
  },
  skillCategoryId: {
    type: Schema.Types.ObjectId,
    ref: 'skill_category',
    required: true,
  }
}, {
  timestamps: true
})

// ! static method to verify ID
protoSkillSchema.statics.verifySkillCategoryId = async function (...ids) {
  if (!checkIfMongoId(...ids))
    throw new Error('Provided Category ID is not valid!')
}

// ! static method to check for skill title conflict
protoSkillSchema.statics.skillAlreadyExistsByTitle = async function (skillTitle) {
  const skillExists = await this.findOne({protoSkillTitleLower: skillTitle.toLowerCase()})

  if (skillExists) 
    throw new Error('Skill with this title already exists!')
}

// !static method to validate skill edit
protoSkillSchema.statics.validateSkillChanges = async function (data, id) {
  // fetch skill to modify
  const existingSkill = await this.findById(id)

  if (!existingSkill)
    throw new Error('Provided skill ID does not match any skill!')

  // check for other skills with the same title
  const skillExistsByTitle = await this.findOne({protoSkillTitleLower: data.protoSkillTitle.toLowerCase()})

  if (skillExistsByTitle)
    throw new Error('Skill with this title already exists!')

  // check if updated skill differs from original skill
  const isDifferent = Object.keys(data).some(key => existingSkill[key] !== data[key])

  if (!isDifferent)
    throw new Error('No skill changes were detected!')
}

// ! pre hook
protoSkillSchema.pre<IProtoSkill>('save', function (next) {
  this.protoSkillTitle = capitalizeFirstChar(this.protoSkillTitle)
  this.protoSkillTitleLower = this.protoSkillTitle.toLowerCase()
  this.protoSkillDescription = capitalizeFirstChar(this.protoSkillDescription)

  next()
})

// ! set hook
// excludes protoSkillTitleLower prop from response object when using .json() method
protoSkillSchema.set('toJSON', {
  transform: function (_, ret) {
    delete ret.protoSkillTitleLower
    return ret
  }
})

const protoSkillModel = model<IProtoSkill, IProtoSkillModel>('proto_skill', protoSkillSchema)

export default protoSkillModel
