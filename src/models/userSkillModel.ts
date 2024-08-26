import { Document, Schema, Model, model } from "mongoose";
import checkIfMongoId from "../utils/checkIfMongoId.js";

interface IUserSkill extends Document {
  mentorId: string
  protoSkillId: Schema.Types.ObjectId
  mentorUuid: string
  proficiency: string
  notes: string,
  isActive: boolean
}

interface IUserSkillModel extends Model<IUserSkill> {
  verifyUserSkillId(...ids: string[]): Promise<void>
  // restrictUserGroupsAccess(userRole: string): Promise<void>
  validateSkillChanges(data: object, id: string): Promise<void>
}

const userSkillSchema = new Schema<IUserSkill>({
  // mentorId is used internally in BE only
  mentorId: {
    type: String,
    required: true
  },
  mentorUuid: {
    type: String,
    ref: 'User',
    required: true
  },
  protoSkillId: {
    type: Schema.Types.ObjectId,
    ref: 'proto_skill',
    required: true
  },
  proficiency: {
    type: String,
    enum: ['beginner', 'intermediate', 'advanced'],
    required: true
  },
  notes: {
    type: String,
    default: ''
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
})

// ! static method to verify user skill IDs
userSkillSchema.statics.verifyUserSkillId = function (...ids) {
  if (!checkIfMongoId(...ids)) {
    if (ids.length > 1) {
      throw new Error('One or more of provided IDs are not valid')
    } else {
      throw new Error('Provided skill ID is not valid')
    }
  }
}

// ! static method to restrict access for specific user groups
// userSkillSchema.statics.restrictUserGroupsAccess = function (userRole) {
//   if (userRole === ('admin' || 'mentee'))
//     throw new Error('Access denied, you do not have permission to access this resource!')
// }

// ! static method to validate user skill edit
userSkillSchema.statics.validateSkillChanges = async function (data, id) {
  // fetch category to modify
  const existingSkill = await this.findById(id)

  if (!existingSkill)
    throw new Error('Provided skill ID does not match any category')

  // check if updated skill differs from original skill
  const isDifferent = Object.keys(data).some(key => existingSkill[key] !== data[key])

  if (!isDifferent)
    throw new Error('No skill changes were detected!')
}

// ! set hook
// excludes mentorId prop from response object when using .json() method
userSkillSchema.set('toJSON', {
  transform: function (_, ret) {
    delete ret.mentorId
    return ret
  }
})

// ! create unique db level index on mentor ID and proficiency
// this only allows one instance of specific proficiency skill per mentor
userSkillSchema.index(
  {
    mentorId: 1,
    proficiency: 1
  },
  {unique: true}
)

const userSkillModel = model<IUserSkill, IUserSkillModel>('user_skill', userSkillSchema)

export default userSkillModel
