import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Post,
  Req,
  Res,
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
import { Request, Response } from 'express';

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

  // Route: /
  @Get('/')
  home(@Req() req: Request, @Res() res: Response) {
    const isAuthenticated = req.oidc?.isAuthenticated(); // Check if the user is logged in
    if (isAuthenticated) {
      res.json({
        message: 'Logged in',
        user: req.oidc.user, // User details
      });
    } else {
      res.json({ message: 'Logged out' });
    }
  }

  // Protected route example
  @Get('/protected')
  protected(@Req() req: Request, @Res() res: Response) {
    if (!req.oidc?.isAuthenticated()) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    res.json({
      message: 'You are authorized',
      user: req.oidc.user,
    });
  }
}
