import { Document, Schema, Model, model, Query } from "mongoose";
import capitalizeFirstChar from "../utils/capitalizeFirstChar.js";
import checkIfMongoId from "../utils/checkIfMongoId.js";

// extend Document with IProtoSkill
interface IProtoSkill extends Document {
  protoSkillTitle: string
  protoSkillTitleLower: string
  protoSkillDescription: string
  skillCategoryId: Schema.Types.ObjectId
  isActive: boolean
}

// extend Query with IProtoSkillQuery and IProtoSkill
interface IProtoSkillQuery extends Query<any, IProtoSkill> {
  _update: Partial<IProtoSkill>
}

// extend Model with IProtoSkillModel
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
    unique: true
  },
  protoSkillDescription: {
    type: String,
  },
  skillCategoryId: {
    type: Schema.Types.ObjectId,
    ref: 'skill_category',
    required: true,
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
})

// ! static method to verify ID
protoSkillSchema.statics.verifySkillCategoryId = function (id) {
  if (!checkIfMongoId(id))
    throw new Error('Provided Category ID is not valid')
}

// ! static method to check for skill title conflict
protoSkillSchema.statics.skillAlreadyExistsByTitle = async function (skillTitle) {
  const skillExists = await this.findOne({
    protoSkillTitleLower: skillTitle.toLowerCase(),
    isActive: true
  })

  if (skillExists) 
    throw new Error('Skill with this title already exists')
}

// !static method to validate skill edit
protoSkillSchema.statics.validateSkillChanges = async function (data, id) {
  // fetch skill to modify
  const existingSkill = await this.findById(id)

  if (!existingSkill)
    throw new Error('Provided skill ID does not match any skill')

  // check for other skills with the same title
  const skillExistsByTitle = await this.findOne({protoSkillTitleLower: data.protoSkillTitle.toLowerCase()})

  if (skillExistsByTitle)
    throw new Error('Skill with this title already exists')

  // check if updated skill differs from original skill
  const isDifferent = Object.keys(data).some(key => existingSkill[key] !== data[key])

  if (!isDifferent)
    throw new Error('No skill changes were detected')
}

// ! pre hooks
// 'save' pre hook
protoSkillSchema.pre<IProtoSkill>('save', function (next) {
  this.protoSkillTitle = capitalizeFirstChar(this.protoSkillTitle)
  this.protoSkillTitleLower = this.protoSkillTitle.toLowerCase()

  if (this.protoSkillDescription)
    this.protoSkillDescription = capitalizeFirstChar(this.protoSkillDescription)

  next()
})

// 'findOneAndUpdate' pre hook
// _update object holds key value pairs for the object specified in 'findOnceAndUpdate' query
protoSkillSchema.pre<IProtoSkillQuery>('findOneAndUpdate', function (next) {
  if (this._update.protoSkillTitle) {
    this._update.protoSkillTitle = capitalizeFirstChar(this._update.protoSkillTitle);
    this._update.protoSkillTitleLower = this._update.protoSkillTitleLower.toLowerCase();
  }

  if (this._update.protoSkillDescription) {
    this._update.protoSkillDescription = capitalizeFirstChar(this._update.protoSkillDescription);
  }

  next();
})

// ! set hook
// excludes model props from response object when using .json() method
protoSkillSchema.set('toJSON', {
  transform: function (_, ret) {
    delete ret.protoSkillTitleLower
    delete ret.isActive
    return ret
  }
})

const protoSkillModel = model<IProtoSkill, IProtoSkillModel>('proto_skill', protoSkillSchema)

export default protoSkillModel
