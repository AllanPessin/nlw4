import { Request, Response } from "express";
import { getCustomRepository } from "typeorm";
import { resolve } from 'path';
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

    const user = await userRepository.findOne({email});

    if (!user) {
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

    const variables = {
      name: user.name,
      title: survey.title,
      description: survey.description,
      user_id: user.id,
      link: process.env.URL_MAIL,
    }
    const npsPath = resolve(__dirname, "..", "views", "emails", "npsMail.hbs");

    const surveyUserAlredyexist = await surveyUserRepository.findOne({
      where: [{user_id: user.id}, {value: null}],
      relations: ["user", "survey"]
    })
    if(surveyUserAlredyexist){
      await SendaMailServices.execute(email, survey.title, variables, npsPath);
      return response.json({surveyUserAlredyexist});
    }

    const surveyUser = surveyUserRepository.create({
      user_id: user.id,
      survey_id
    })
    
    await surveyUserRepository.save(surveyUser);

    await SendaMailServices.execute(email, survey.title, variables, npsPath, );

    return response.json(surveyUser);
  }
}

export { SendMailController };

