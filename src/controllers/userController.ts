import { Request, Response } from 'express';
import { getCustomRepository } from 'typeorm';
import { UserRepository } from '../repositories/UserRepository';

class UserController {
 async create(request: Request, response: Response){
  const {name, email} = request.body;
  const userRepository = getCustomRepository(UserRepository);
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
