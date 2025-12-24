import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { UserRole } from 'src/users/users.service';
import { ROLES_KEY } from '../decorators/roles.decorator';

// route A

// workflow ->
// client -> jwtauthguard -> validate the token and attach the current user in the request
// -> rolesguard check if current user role matches the required role -> if match found
// proceed to controller -> if not forbidden exception

@Injectable()
export class RolesGuard implements CanActivate {
  //Reflector -> utility that will help to access metadata

  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    // retrive the roles metadata set by the roles decorator

    const requiredRoles = this.reflector.getAllAndOverride<UserRole[]>(
      ROLES_KEY,
      [
        context.getHandler(), // method level metadata
        context.getClass(), //class level metadata
      ],
    );

    if (!requiredRoles) {
      return true;
    }

    const { user } = context.switchToHttp().getRequest();

    if (!user) {
      throw new ForbiddenException('User not authenticated');
    }

    // debug log to help diagnose permission issues
    // eslint-disable-next-line no-console
    console.debug('RolesGuard:', { requiredRoles, userRole: user.role, user });

    const hasRequiredRole = requiredRoles.some((role) => user.role === role);
    console.log(hasRequiredRole,"hasRequiredRole",user)
    if (!hasRequiredRole) {
      throw new ForbiddenException('Insufficient permission');
    }

    return true;
  }
}