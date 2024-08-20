import { Request, Response, NextFunction } from "express"

// IMPORTANT: Has to be used after the verifyToken middleware to have access to req.userRole
// Refer to verifyToken function for details regarding extracting role from decoded JWT token
const checkIfAdmin = (
  req: Request, 
  res: Response, 
  next: NextFunction
) => {
  if (req.userRole !== 'admin')
    res.status(403).json({error: 'Access denied, you do not have permission to access this resource!'})

  next()
}

export default checkIfAdmin
