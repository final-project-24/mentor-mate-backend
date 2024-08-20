import mongoose from "mongoose"

// The function will return a boolean indicating if provided IDs have valid format
// Can be used with a single ID or multiple IDs
// When providing multiple IDs it will return false even if only one ID is invalid
const checkIfMongoId = (...ids: string[]) => {
  return ids.every(id => mongoose.Types.ObjectId.isValid(id))
}

export default checkIfMongoId
