import {
  registerDecorator,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { Inject, Injectable } from '@nestjs/common';
import { IUsuariosRepository } from '../domain/usuarios.interface.repository';

@Injectable()
@ValidatorConstraint({ async: true })
export class UserEmailValidation implements ValidatorConstraintInterface {
  constructor(
    @Inject('IUsuariosRepository')
    private readonly userRepository: IUsuariosRepository,
  ) {}

  async validate(value: string): Promise<boolean> {
    return this.userRepository.buscarPorEmail(value).then((user) => {
      return !user;
    });
  }
}

export const IsEmailAlreadyExist = (validateOptions: ValidationOptions) => {
  return (obj: object, propertie: string) => {
    registerDecorator({
      target: obj.constructor,
      propertyName: propertie,
      options: validateOptions,
      constraints: [],
      validator: UserEmailValidation,
    });
  };
};
