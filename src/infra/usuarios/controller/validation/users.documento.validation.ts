import {
  registerDecorator,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { Inject, Injectable } from '@nestjs/common';
import { IRepositorioDeUsuariosPrisma } from '../../persistence/usuarios.interface.repository';

@Injectable()
@ValidatorConstraint({ async: true })
export class UserDocumentValidation implements ValidatorConstraintInterface {
  constructor(
    @Inject('IRepositorioDeUsuariosPrisma')
    private readonly userRepository: IRepositorioDeUsuariosPrisma,
  ) {}

  async validate(value: string): Promise<boolean> {
    return this.userRepository.buscarPorDocumentoValidacao(value).then((user) => {
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
