import {
  BadRequestException,
  Body,
  Controller,
  Post,
  // Request,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterRequestDTO } from './dto/register-request.dto';
import { LoginResponseDTO } from './dto/login-response.dto';
import { RegisterResponseDTO } from './dto/register-response.dto';
// import { GqlLocalAuthGuard } from './guards/jwt.guard';
import { LoginRequestDTO } from './dto/login-request.dto';
import { AuthGuard } from '@nestjs/passport';
import { Public } from './decorators/public.decorator';

// GqlLocalAuthGuard;

@Public()
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(AuthGuard('local'))
  @Post('login')
  async login(
    @Body() loginBody: LoginRequestDTO,
  ): Promise<LoginResponseDTO | BadRequestException> {
    return this.authService.login(loginBody);
  }

  @Post('register')
  async register(
    @Body() registerBody: RegisterRequestDTO,
  ): Promise<RegisterResponseDTO | BadRequestException> {
    return await this.authService.register(registerBody);
  }
}
