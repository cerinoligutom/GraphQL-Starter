import { UserModel } from '@/db/models';
import { BadInputError } from '@/errors';
import { IContext } from '@/shared/interfaces';
import { bcryptUtil, createSchemaValidator } from '@/utils';
import * as yup from 'yup';

export interface IRegisterDTO {
  firstName: string;
  middleName?: string;
  lastName: string;
  email: string;
  password: string;
}

const schema = yup.object().shape({
  firstName: UserModel.yupSchema.firstName,
  middleName: UserModel.yupSchema.middleName,
  lastName: UserModel.yupSchema.lastName,
  email: UserModel.yupSchema.email,
  password: UserModel.yupSchema.password,
});
const validateDTO = createSchemaValidator<IRegisterDTO>(schema);

interface IRegisterUseCaseResult {
  user: UserModel;
}
export async function registerUseCase(dto: IRegisterDTO, ctx: IContext): Promise<IRegisterUseCaseResult> {
  const { firstName, middleName, lastName, email, password } = await validateDTO(dto);

  const hash = await bcryptUtil.generateHash(password);

  const existingEmail = await UserModel.query().where('email', email).first();
  if (existingEmail) {
    throw new BadInputError({ email: ['Email already taken'] });
  }

  const form: UserModel = new UserModel();
  form.set({
    firstName,
    middleName,
    lastName,
    email,
    hash,
  });

  const user = await UserModel.query().insertAndFetch(form);

  return { user };
}
