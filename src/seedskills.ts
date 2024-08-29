import skillCategoryModel from './models/skillCategoryModel.js'
import protoSkillModel from './models/protoSkillModel.js'
import userSkillModel from './models/userSkillModel.js'
import userModel from './models/userModel.js'
import db from './db.js'
import bcrypt from 'bcryptjs'
import { v4 } from 'uuid'

const hashedPW = await bcrypt.hash('1234', 10)

// ! the whole process requires 3 mentors

// mentor seeding function
async function seedMentors() {
  const mentors = [
    {
      userName: 'seedMentor0',
      email: 'seedMentor0@seed.com',
      password: hashedPW,
      role: 'mentor',
      uuidv4: v4()
    },
    {
      userName: 'seedMentor1',
      email: 'seedMentor1@seed.com',
      password: hashedPW,
      role: 'mentor',
      uuidv4: v4()
    },
    {
      userName: 'seedMentor2',
      email: 'seedMentor2@seed.com',
      password: hashedPW,
      role: 'mentor',
      uuidv4: v4()
    }
  ]

  try {
    await userModel.insertMany(mentors)
    console.log('✅ Mentors seeded')
  } catch (err) {
    console.error('❌ Error seeding mentors:', err)
  }
}

// skill category seeding function
async function seedSkillCategories() {
  const skillCategories = [
    { 
      skillCategoryTitle: 'Programming', 
      skillCategoryTitleLower: 'programming',
      skillCategoryDescription: 'All programming-related skills' 
    },
    { 
      skillCategoryTitle: 'Design', 
      skillCategoryTitleLower: 'design',
      skillCategoryDescription: 'All design-related skills' 
    },
    { 
      skillCategoryTitle: 'Marketing', 
      skillCategoryTitleLower: 'marketing',
      skillCategoryDescription: 'All marketing-related skills' 
    },
  ]

  try {
    await skillCategoryModel.insertMany(skillCategories)
    console.log('✅ Skill categories seeded')
  } catch (err) {
    console.error('❌ Error seeding skill categories:', err)
  }
}

// protoSkill seeding function
async function seedProtoSkills() {
  try {
    const categories = await skillCategoryModel.find()
    const protoSkills = [
      { 
        protoSkillTitle: 'JavaScript', 
        protoSkillTitleLower: 'javascript',
        protoSkillDescription: 'JavaScript programming language', 
        skillCategoryId: categories.find(c => c.skillCategoryTitle === 'Programming')._id 
      },
      { 
        protoSkillTitle: 'Photoshop', 
        protoSkillTitleLower: 'photoshop',
        protoSkillDescription: 'Photo editing software', 
        skillCategoryId: categories.find(c => c.skillCategoryTitle === 'Design')._id 
      },
      { 
        protoSkillTitle: 'SEO', 
        protoSkillTitleLower: 'seo',
        protoSkillDescription: 'Search engine optimization', 
        skillCategoryId: categories.find(c => c.skillCategoryTitle === 'Marketing')._id 
      },
    ]

    await protoSkillModel.insertMany(protoSkills)
    console.log('✅ Proto skills seeded')
  } catch (err) {
    console.error('❌ Error seeding proto skills:', err)
  }
}

// userSkill seeding function
async function seedUserSkills() {
  try {
    const protoSkills = await protoSkillModel.find()
    const mentors = await userModel.find({ 
      userName: {$regex: /^seedMentor/} 
    })

    if (mentors.length < 3) {
      throw new Error('Not enough mentors found in the database')
    }

    const userSkills = [
      // mentor 1 skills
      {
        mentorId: mentors[0]._id.toString(),
        mentorUuid: mentors[0].uuid,
        protoSkillId: protoSkills.find(s => s.protoSkillTitle === 'JavaScript')._id,
        proficiency: 'beginner',
        notes: 'Very skilled in JS',
      },
      {
        mentorId: mentors[0]._id.toString(),
        mentorUuid: mentors[0].uuid,
        protoSkillId: protoSkills.find(s => s.protoSkillTitle === 'JavaScript')._id,
        proficiency: 'advanced',
        notes: 'Very skilled in JS',
      },
      {
        mentorId: mentors[0]._id.toString(),
        mentorUuid: mentors[0].uuid,
        protoSkillId: protoSkills.find(s => s.protoSkillTitle === 'JavaScript')._id,
        proficiency: 'intermediate',
        notes: 'Very skilled in JS',
      },
      // mentor 2 skills
      {
        mentorId: mentors[1]._id.toString(),
        mentorUuid: mentors[1].uuid,
        protoSkillId: protoSkills.find(s => s.protoSkillTitle === 'Photoshop')._id,
        proficiency: 'beginner',
        notes: 'Proficient with design tools',
      },
      {
        mentorId: mentors[1]._id.toString(),
        mentorUuid: mentors[1].uuid,
        protoSkillId: protoSkills.find(s => s.protoSkillTitle === 'Photoshop')._id,
        proficiency: 'intermediate',
        notes: 'Proficient with design tools',
      },
      {
        mentorId: mentors[1]._id.toString(),
        mentorUuid: mentors[1].uuid,
        protoSkillId: protoSkills.find(s => s.protoSkillTitle === 'Photoshop')._id,
        proficiency: 'advanced',
        notes: 'Proficient with design tools',
      },
      // mentor 3 skills
      {
        mentorId: mentors[2]._id.toString(),
        mentorUuid: mentors[2].uuid,
        protoSkillId: protoSkills.find(s => s.protoSkillTitle === 'SEO')._id,
        proficiency: 'beginner',
        notes: 'Learning the ropes of SEO',
      },
      {
        mentorId: mentors[2]._id.toString(),
        mentorUuid: mentors[2].uuid,
        protoSkillId: protoSkills.find(s => s.protoSkillTitle === 'SEO')._id,
        proficiency: 'intermediate',
        notes: 'Learning the ropes of SEO',
      },
      {
        mentorId: mentors[2]._id.toString(),
        mentorUuid: mentors[2].uuid,
        protoSkillId: protoSkills.find(s => s.protoSkillTitle === 'SEO')._id,
        proficiency: 'advanced',
        notes: 'Learning the ropes of SEO',
      },
    ]

    await userSkillModel.insertMany(userSkills)
    console.log('✅ User skills seeded')
  } catch (err) {
    console.error('❌ Error seeding user skills:', err)
  }
}

// combine all seeding functions
async function seedSkillsData() {
  try {
    // clear existing data before seeding
    console.log("✅ Clearing previous skill-related data...")
    await userModel.deleteMany({
      userName: { $regex: /^seedMentor/ }
    })
    await skillCategoryModel.deleteMany()
    await protoSkillModel.deleteMany()
    await userSkillModel.deleteMany()
    
    // execute all of the seeding functions in the specific order they need to be executed
    await seedSkillCategories()
    await seedProtoSkills()
    await seedMentors()
    await seedUserSkills()
  } catch (err) {
    console.error('❌ Error during the skill seeding process:', err)
  }
}

// connect to db and run seedSkillsData function
const insertTestData = async () => {
  try {
    await db.connect()
    await seedSkillsData()
  } catch (error) {
    console.error("❌ Error seeding skill data:", error)
  } finally {
    await db.close()
  }
}

insertTestData()
