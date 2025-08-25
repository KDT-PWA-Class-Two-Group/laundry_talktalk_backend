import { Body, Controller, Post, Put, Req } from '@nestjs/common';
import { UsersService } from './users.service';

class UpdateProfileDto { newPassword?: string; email?: string; phone?: string; }
class VerifyPasswordDto { password: string; }

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Put('me/profile')
  async updateProfile(@Req() req: any, @Body() dto: UpdateProfileDto) {
    const userId = 1; // TODO: JWT에서 req.user.id
    return this.usersService.updateProfile(userId, dto);
  }

  @Post('me/verify-password')
  async verifyPassword(@Req() req: any, @Body() dto: VerifyPasswordDto) {
    const userId = 1; // TODO: JWT에서 req.user.id
    return this.usersService.verifyPassword(userId, dto.password);
  }
}
