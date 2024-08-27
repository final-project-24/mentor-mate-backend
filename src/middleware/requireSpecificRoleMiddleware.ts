import { Request, Response, NextFunction } from "express"

// IMPORTANT: has to be used after the verifyToken middleware to have access to req.userRole
// refer to verifyToken function for details regarding extracting role from decoded JWT token

// middleware factory function
const requireSpecificRole = (role: string) => {
  return (
    req: Request, 
    res: Response, 
    next: NextFunction
  ) => {
    if (req.userRole !== role)
      return res.status(403).json({error: 'Access denied, you do not have permission to access this resource!'})
  
    next()
  }
}

export default requireSpecificRole
