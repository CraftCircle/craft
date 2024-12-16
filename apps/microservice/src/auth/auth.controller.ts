import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterRequestDTO } from './dto/register-request.dto';
import { LoginResponseDTO } from './dto/login-response.dto';
import { RegisterResponseDTO } from './dto/register-response.dto';
import { LoginRequestDTO } from './dto/login-request.dto';
import { AuthGuard } from '@nestjs/passport';
import { Public } from './decorators/public.decorator';
import { Request, Response } from 'express';
import { requiresAuth } from 'express-openid-connect';

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

  /**
   * Route: /
   * Displays user's authentication status
   */
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

  /**
   * Route: /protected
   * Example of a protected route
   */
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

  /**
   * Route: /profile
   * Requires authentication
   */
  @Get('/profile')
  async getProfile(@Req() req: Request, @Res() res: Response) {
    requiresAuth()(req, res, () => {
      if (!req.oidc?.isAuthenticated()) {
        return res.status(401).json({ message: 'Unauthorized' });
      }

      res.json({
        message: 'User profile information',
        profile: req.oidc.user, // Returns user profile details
      });
    });
  }

  /**
   * Handle the callback after authentication
   */
  @Get('/callback')
  async authCallback(@Req() req: Request, @Res() res: Response) {
    const isAuthenticated = req.oidc?.isAuthenticated(); // Check if the user is logged in
    if (isAuthenticated) {
      // Redirect to the desired page after login
      return res.redirect('/profile');
    }
    res.status(401).json({ message: 'Authentication failed' });
  }
}
