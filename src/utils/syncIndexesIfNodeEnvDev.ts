import userSkillModel from "../models/userSkillModel.js"
import { NODE_ENV } from "./config.js"

const syncIndexesIfNodeEnvDev = async () => {
  if (NODE_ENV === 'development') {
    try {
      await userSkillModel.syncIndexes()
    } catch (error) {
      console.log(`❌ syncIndexes for 'userSkillModel' failed: ${error}`)
    }
  }
}

export default syncIndexesIfNodeEnvDev
