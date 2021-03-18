import { Request, Response } from 'express'
import { getRepository, ReturningStatementNotSupportedError } from 'typeorm';
import { User } from '../models/user';

class UserController {
 async create(request: Request, response: Response){
  const {name, email} = request.body;
  const userRepository = getRepository(User);
  const userAlreadyExist = await userRepository.findOne({
    email
  });
  if(userAlreadyExist) {
    return response.status(400).json({
      erros: "User already exist!",
    })
  }
  const user = userRepository.create({
    name, email
  })

  await userRepository.save(user);
  return response.json(user);
 } 
}

export { UserController };