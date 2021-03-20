import { Request, Response } from "express";
import { getCustomRepository } from "typeorm";
import { SurveysRepository } from "../repositories/SurveysRepository";
import { SurveyUserRepository } from "../repositories/SurveyUsersRepository";
import { UserRepository } from "../repositories/UserRepository";
import SendaMailServices from "../services/SendaMailServices";

class SendMailController {
  async execute(request: Request, response: Response) {
    const { email, survey_id } = request.body;
    const userRepository = getCustomRepository(UserRepository);
    const surveyRepository = getCustomRepository(SurveysRepository);
    const surveyUserRepository = getCustomRepository(SurveyUserRepository);

    const userAlreadyExist = await userRepository.findOne({email});

    if (!userAlreadyExist) {
      return response.status(400).json({
        error: "User does not exists",
      })
    }

    const survey = await surveyRepository.findOne({id: survey_id});
    
    if(!survey) {
      return response.status(400).json({
        error: "Survey does not exists",
      })
    }

    const surveyUser = surveyUserRepository.create({
      user_id: userAlreadyExist.id,
      survey_id
    })
    await surveyUserRepository.save(surveyUser);

    await SendaMailServices.execute(email, survey.title, survey.description);

    return response.json(surveyUser);
  }
}

export { SendMailController };

