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
      userNameLower: 'seedmentor0',
      email: 'seedMentor0@seed.com',
      password: hashedPW,
      role: 'mentor',
      uuidv4: v4()
    },
    {
      userName: 'seedMentor1',
      userNameLower: 'seedmentor1',
      email: 'seedMentor1@seed.com',
      password: hashedPW,
      role: 'mentor',
      uuidv4: v4()
    },
    {
      userName: 'seedMentor2',
      userNameLower: 'seedmentor2',
      email: 'seedMentor2@seed.com',
      password: hashedPW,
      role: 'mentor',
      uuidv4: v4()
    },
    {
      userName: 'seedMentor3',
      userNameLower: 'seedmentor3',
      email: 'seedMentor3@seed.com',
      password: hashedPW,
      role: 'mentor',
      uuidv4: v4()
    },
    {
      userName: 'seedMentor4',
      userNameLower: 'seedmentor4',
      email: 'seedMentor4@seed.com',
      password: hashedPW,
      role: 'mentor',
      uuidv4: v4()
    },
    {
      userName: 'seedMentor5',
      userNameLower: 'seedmentor5',
      email: 'seedMentor5@seed.com',
      password: hashedPW,
      role: 'mentor',
      uuidv4: v4()
    },
    {
      userName: 'seedMentor6',
      userNameLower: 'seedmentor6',
      email: 'seedMentor6@seed.com',
      password: hashedPW,
      role: 'mentor',
      uuidv4: v4()
    },
    {
      userName: 'seedMentor7',
      userNameLower: 'seedmentor7',
      email: 'seedMentor7@seed.com',
      password: hashedPW,
      role: 'mentor',
      uuidv4: v4()
    },
    {
      userName: 'seedMentor8',
      userNameLower: 'seedmentor8',
      email: 'seedMentor8@seed.com',
      password: hashedPW,
      role: 'mentor',
      uuidv4: v4()
    }
  ]

  try {
    await userModel.insertMany(mentors)
    console.log('✅ Mentors seeded')
  } catch (error) {
    console.error('❌ Error seeding mentors:', error)
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
    { 
      skillCategoryTitle: 'Management', 
      skillCategoryTitleLower: 'management',
      skillCategoryDescription: 'All management-related skills' 
    },
    { 
      skillCategoryTitle: 'Writing', 
      skillCategoryTitleLower: 'writing',
      skillCategoryDescription: 'All writing-related skills' 
    },
    { 
      skillCategoryTitle: 'Data Science', 
      skillCategoryTitleLower: 'data science',
      skillCategoryDescription: 'All data science-related skills' 
    },
    { 
      skillCategoryTitle: 'Sales', 
      skillCategoryTitleLower: 'sales',
      skillCategoryDescription: 'All sales-related skills' 
    },
    { 
      skillCategoryTitle: 'Finance', 
      skillCategoryTitleLower: 'finance',
      skillCategoryDescription: 'All finance-related skills' 
    },
    { 
      skillCategoryTitle: 'Customer Support', 
      skillCategoryTitleLower: 'customer support',
      skillCategoryDescription: 'All customer support-related skills' 
    }
  ]

  try {
    await skillCategoryModel.insertMany(skillCategories)
    console.log('✅ Skill categories seeded')
  } catch (error) {
    console.error('❌ Error seeding skill categories:', error)
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
        skillCategoryId: categories.find(c => c.skillCategoryTitle === 'Programming')._id.toString()
      },
      { 
        protoSkillTitle: 'Photoshop', 
        protoSkillTitleLower: 'photoshop',
        protoSkillDescription: 'Photo editing software', 
        skillCategoryId: categories.find(c => c.skillCategoryTitle === 'Design')._id.toString()
      },
      { 
        protoSkillTitle: 'SEO', 
        protoSkillTitleLower: 'seo',
        protoSkillDescription: 'Search engine optimization', 
        skillCategoryId: categories.find(c => c.skillCategoryTitle === 'Marketing')._id.toString()
      },
      { 
        protoSkillTitle: 'Leadership', 
        protoSkillTitleLower: 'leadership',
        protoSkillDescription: 'Leadership and management skills', 
        skillCategoryId: categories.find(c => c.skillCategoryTitle === 'Management')._id.toString()
      },
      { 
        protoSkillTitle: 'Copywriting', 
        protoSkillTitleLower: 'copywriting',
        protoSkillDescription: 'Writing engaging and persuasive content', 
        skillCategoryId: categories.find(c => c.skillCategoryTitle === 'Writing')._id.toString()
      },
      { 
        protoSkillTitle: 'Data Analysis', 
        protoSkillTitleLower: 'data analysis',
        protoSkillDescription: 'Analyzing data to extract insights', 
        skillCategoryId: categories.find(c => c.skillCategoryTitle === 'Data Science')._id.toString() 
      },
      { 
        protoSkillTitle: 'Sales Techniques', 
        protoSkillTitleLower: 'sales techniques',
        protoSkillDescription: 'Techniques for effective selling', 
        skillCategoryId: categories.find(c => c.skillCategoryTitle === 'Sales')._id.toString()
      },
      { 
        protoSkillTitle: 'Financial Planning', 
        protoSkillTitleLower: 'financial planning',
        protoSkillDescription: 'Managing and planning finances', 
        skillCategoryId: categories.find(c => c.skillCategoryTitle === 'Finance')._id.toString()
      },
      { 
        protoSkillTitle: 'Customer Service', 
        protoSkillTitleLower: 'customer service',
        protoSkillDescription: 'Providing excellent customer service', 
        skillCategoryId: categories.find(c => c.skillCategoryTitle === 'Customer Support')._id.toString() 
      }
    ]    

    await protoSkillModel.insertMany(protoSkills)
    console.log('✅ Proto skills seeded')
  } catch (error) {
    console.error('❌ Error seeding proto skills:', error)
  }
}

// userSkill seeding function
async function seedUserSkills() {
  try {
    const protoSkills = await protoSkillModel.find()
    const mentors = await userModel.find({ 
      userNameLower: { $regex: /^seedmentor/ } 
    })

    if (mentors.length < 9) {
      throw new Error('Not enough mentors found in the database')
    }

    const userSkills = [
      // mentor 1 skills (JavaScript, Design, SEO)
      {
        mentorId: mentors[0]._id.toString(),
        mentorUuid: mentors[0].uuid,
        protoSkillId: protoSkills.find(s => s.protoSkillTitleLower === 'javascript')._id.toString(),
        proficiency: 'advanced',
        notes: 'Advanced JavaScript expert',
      },
      {
        mentorId: mentors[0]._id.toString(),
        mentorUuid: mentors[0].uuid,
        protoSkillId: protoSkills.find(s => s.protoSkillTitleLower === 'photoshop')._id.toString(),
        proficiency: 'beginner',
        notes: 'Basic photo editing skills',
      },
      {
        mentorId: mentors[0]._id.toString(),
        mentorUuid: mentors[0].uuid,
        protoSkillId: protoSkills.find(s => s.protoSkillTitleLower === 'seo')._id.toString(),
        proficiency: 'advanced',
        notes: 'Advanced SEO strategies',
      },
      // mentor 2 skills (Photoshop, Data Analysis, Marketing)
      {
        mentorId: mentors[1]._id.toString(),
        mentorUuid: mentors[1].uuid,
        protoSkillId: protoSkills.find(s => s.protoSkillTitleLower === 'photoshop')._id.toString(),
        proficiency: 'beginner',
        notes: 'Basic photo editing skills',
      },
      {
        mentorId: mentors[1]._id.toString(),
        mentorUuid: mentors[1].uuid,
        protoSkillId: protoSkills.find(s => s.protoSkillTitleLower === 'javascript')._id.toString(),
        proficiency: 'beginner',
        notes: 'Learning the ropes of JavaScript',
      },
      {
        mentorId: mentors[1]._id.toString(),
        mentorUuid: mentors[1].uuid,
        protoSkillId: protoSkills.find(s => s.protoSkillTitleLower === 'photoshop')._id.toString(),
        proficiency: 'advanced',
        notes: 'Expert in Photoshop',
      },
      // mentor 3 skills (SEO, Leadership, Sales Techniques)
      {
        mentorId: mentors[2]._id.toString(),
        mentorUuid: mentors[2].uuid,
        protoSkillId: protoSkills.find(s => s.protoSkillTitleLower === 'seo')._id.toString(),
        proficiency: 'advanced',
        notes: 'Advanced SEO strategist',
      },
      {
        mentorId: mentors[2]._id.toString(),
        mentorUuid: mentors[2].uuid,
        protoSkillId: protoSkills.find(s => s.protoSkillTitleLower === 'leadership')._id.toString(),
        proficiency: 'intermediate',
        notes: 'Developing leadership skills',
      },
      {
        mentorId: mentors[2]._id.toString(),
        mentorUuid: mentors[2].uuid,
        protoSkillId: protoSkills.find(s => s.protoSkillTitleLower === 'sales techniques')._id.toString(),
        proficiency: 'beginner',
        notes: 'Learning sales techniques',
      },
      // mentor 4 skills (Leadership, Financial Planning, Customer Service)
      {
        mentorId: mentors[3]._id.toString(),
        mentorUuid: mentors[3].uuid,
        protoSkillId: protoSkills.find(s => s.protoSkillTitleLower === 'leadership')._id.toString(),
        proficiency: 'beginner',
        notes: 'Developing leadership skills',
      },
      {
        mentorId: mentors[3]._id.toString(),
        mentorUuid: mentors[3].uuid,
        protoSkillId: protoSkills.find(s => s.protoSkillTitleLower === 'financial planning')._id.toString(),
        proficiency: 'advanced',
        notes: 'Expert in financial planning and strategy',
      },
      {
        mentorId: mentors[3]._id.toString(),
        mentorUuid: mentors[3].uuid,
        protoSkillId: protoSkills.find(s => s.protoSkillTitleLower === 'customer service')._id.toString(),
        proficiency: 'beginner',
        notes: 'Learning customer service best practices',
      },
      // mentor 5 skills (JavaScript, Data Analysis, Sales Techniques)
      {
        mentorId: mentors[4]._id.toString(),
        mentorUuid: mentors[4].uuid,
        protoSkillId: protoSkills.find(s => s.protoSkillTitleLower === 'javascript')._id.toString(),
        proficiency: 'intermediate',
        notes: 'Good understanding of JavaScript',
      },
      {
        mentorId: mentors[4]._id.toString(),
        mentorUuid: mentors[4].uuid,
        protoSkillId: protoSkills.find(s => s.protoSkillTitleLower === 'data analysis')._id.toString(),
        proficiency: 'beginner',
        notes: 'Starting out in data analysis',
      },
      {
        mentorId: mentors[4]._id.toString(),
        mentorUuid: mentors[4].uuid,
        protoSkillId: protoSkills.find(s => s.protoSkillTitleLower === 'sales techniques')._id.toString(),
        proficiency: 'advanced',
        notes: 'Highly skilled in sales techniques',
      },
      // mentor 6 skills (Copywriting, SEO, Financial Planning)
      {
        mentorId: mentors[5]._id.toString(),
        mentorUuid: mentors[5].uuid,
        protoSkillId: protoSkills.find(s => s.protoSkillTitleLower === 'copywriting')._id.toString(),
        proficiency: 'advanced',
        notes: 'Expert in crafting persuasive content',
      },
      {
        mentorId: mentors[5]._id.toString(),
        mentorUuid: mentors[5].uuid,
        protoSkillId: protoSkills.find(s => s.protoSkillTitleLower === 'seo')._id.toString(),
        proficiency: 'intermediate',
        notes: 'Solid knowledge of SEO principles',
      },
      {
        mentorId: mentors[5]._id.toString(),
        mentorUuid: mentors[5].uuid,
        protoSkillId: protoSkills.find(s => s.protoSkillTitleLower === 'financial planning')._id.toString(),
        proficiency: 'beginner',
        notes: 'Beginning to understand financial planning',
      },
      // mentor 7 skills (JavaScript, Leadership, Data Analysis)
      {
        mentorId: mentors[6]._id.toString(),
        mentorUuid: mentors[6].uuid,
        protoSkillId: protoSkills.find(s => s.protoSkillTitleLower === 'javascript')._id.toString(),
        proficiency: 'advanced',
        notes: 'Advanced JavaScript skills',
      },
      {
        mentorId: mentors[6]._id.toString(),
        mentorUuid: mentors[6].uuid,
        protoSkillId: protoSkills.find(s => s.protoSkillTitleLower === 'leadership')._id.toString(),
        proficiency: 'beginner',
        notes: 'Building leadership abilities',
      },
      {
        mentorId: mentors[6]._id.toString(),
        mentorUuid: mentors[6].uuid,
        protoSkillId: protoSkills.find(s => s.protoSkillTitleLower === 'javascript')._id.toString(),
        proficiency: 'intermediate',
        notes: 'Intermediate JavaScript skills',
      },
      // mentor 8 skills (Marketing, Customer Service, Copywriting)
      {
        mentorId: mentors[7]._id.toString(),
        mentorUuid: mentors[7].uuid,
        protoSkillId: protoSkills.find(s => s.protoSkillTitleLower === 'copywriting')._id.toString(),
        proficiency: 'beginner',
        notes: 'Beginner copywriting skills',
      },
      {
        mentorId: mentors[7]._id.toString(),
        mentorUuid: mentors[7].uuid,
        protoSkillId: protoSkills.find(s => s.protoSkillTitleLower === 'customer service')._id.toString(),
        proficiency: 'intermediate',
        notes: 'Developing customer service skills',
      },
      {
        mentorId: mentors[7]._id.toString(),
        mentorUuid: mentors[7].uuid,
        protoSkillId: protoSkills.find(s => s.protoSkillTitleLower === 'copywriting')._id.toString(),
        proficiency: 'intermediate',
        notes: 'Intermediate copywriting skills',
      },
      // mentor 9 skills (Leadership, Sales Techniques, Copywriting)
      {
        mentorId: mentors[8]._id.toString(),
        mentorUuid: mentors[8].uuid,
        protoSkillId: protoSkills.find(s => s.protoSkillTitleLower === 'leadership')._id.toString(),
        proficiency: 'advanced',
        notes: 'Expert in leadership and team management',
      },
      {
        mentorId: mentors[8]._id.toString(),
        mentorUuid: mentors[8].uuid,
        protoSkillId: protoSkills.find(s => s.protoSkillTitleLower === 'sales techniques')._id.toString(),
        proficiency: 'beginner',
        notes: 'Beginning to master sales techniques',
      },
      {
        mentorId: mentors[8]._id.toString(),
        mentorUuid: mentors[8].uuid,
        protoSkillId: protoSkills.find(s => s.protoSkillTitleLower === 'copywriting')._id.toString(),
        proficiency: 'intermediate',
        notes: 'Intermediate copywriting skills',
      },
    ]

    await userSkillModel.insertMany(userSkills)
    console.log('✅ User skills seeded')
  } catch (error) {
    console.error('❌ Error seeding user skills:', error)
  }
}

// combine all seeding functions
async function seedSkillsData() {
  try {
    // clear existing data before seeding
    console.log("✅ Clearing previous skill-related data...")
    await userModel.deleteMany({
      userNameLower: { $regex: /^seedmentor/ }
    })
    await skillCategoryModel.deleteMany()
    await protoSkillModel.deleteMany()
    await userSkillModel.deleteMany()
    
    // execute all of the seeding functions in the specific order they need to be executed
    await seedMentors()
    await seedSkillCategories()
    await seedProtoSkills()
    await seedUserSkills()
  } catch (error) {
    console.error('❌ Error during the skill seeding process:', error)
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
