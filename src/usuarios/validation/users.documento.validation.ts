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
export class UserDocumentValidation implements ValidatorConstraintInterface {
  constructor(
    @Inject('IUsuariosRepository')
    private readonly userRepository: IUsuariosRepository,
  ) {}

  async validate(value: string): Promise<boolean> {
    return this.userRepository.buscarPorDocumento(value).then((user) => {
      return !user;
    });
  }
}

export const IsDocumentAlreadyExist = (validateOptions: ValidationOptions) => {
  return (obj: object, propertie: string) => {
    registerDecorator({
      target: obj.constructor,
      propertyName: propertie,
      options: validateOptions,
      constraints: [],
      validator: UserDocumentValidation,
    });
  };
};
