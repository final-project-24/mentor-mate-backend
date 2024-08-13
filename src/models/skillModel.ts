import mongoose from 'mongoose'

const skillSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    level: {
      type: String,
      required: true,
      enum: ['beginner', 'intermediate', 'advanced'],
    },
    yearsOfExperience: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true,
  }
)

skillSchema.pre("save", async function (next) {
  this.name = this.name[0].toLocaleUpperCase() + this.name.slice(1)
  next();
})

const skillModel = mongoose.model('Skill', skillSchema)

export default skillModel
