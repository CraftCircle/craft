import { Resolver, Mutation, Args } from '@nestjs/graphql';
import { AuthService } from './auth.service';
import { RegisterRequestDto } from './dto/register-request.dto';
import { RegisterResponseDTO } from './dto/register-response.dto';

@Resolver()
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}

  @Mutation(() => RegisterResponseDTO) 
  async register(@Args('registerData') registerData: RegisterRequestDto): Promise<RegisterResponseDTO> {
    return this.authService.register(registerData);
  }
}
