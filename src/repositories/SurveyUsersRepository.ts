import { EntityRepository, Repository } from "typeorm";
import { SurveyUser } from "../models/surveyUser";

@EntityRepository(SurveyUser)
class SurveyUserRepository extends Repository<SurveyUser>{}

export { SurveyUserRepository }