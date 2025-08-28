import { Injectable, Logger } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class MailService {
  private readonly logger = new Logger(MailService.name);
  private transporter: nodemailer.Transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS, // Gmail 앱 비밀번호 필요
      },
    });

    // 연결 테스트
    this.verifyConnection();
  }

  private async verifyConnection() {
    try {
      await this.transporter.verify();
      this.logger.log('✅ 메일 서버 연결 성공');
    } catch (error) {
      this.logger.error('❌ 메일 서버 연결 실패:', error.message);
    }
  }

  async sendResetPasswordMail(to: string, token: string) {
    try {
      const resetLink = `${process.env.FRONTEND_URL}/auth/reset-password?token=${token}`;

      const info = await this.transporter.sendMail({
        from: `"LaundryTalk Support" <${process.env.MAIL_USER}>`,
        to,
        subject: '🔐 LaundryTalk 비밀번호 재설정',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #2563eb;">비밀번호 재설정 요청</h2>
            <p>안녕하세요! LaundryTalk에서 비밀번호 재설정을 요청하셨습니다.</p>
            <p>아래 버튼을 클릭하여 새 비밀번호를 설정하세요:</p>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="${resetLink}" 
                 style="display: inline-block; padding: 12px 30px; background: #2563eb; color: white; 
                        text-decoration: none; border-radius: 5px; font-weight: bold;">
                비밀번호 재설정하기
              </a>
            </div>
            
            <p style="color: #666; font-size: 14px;">
              ⏰ <strong>중요:</strong> 이 링크는 30분 동안만 유효합니다.<br>
              🔒 요청하지 않으셨다면 이 메일을 무시하세요.
            </p>
            
            <hr style="margin: 30px 0; border: none; border-top: 1px solid #eee;">
            <p style="color: #999; font-size: 12px; text-align: center;">
              LaundryTalk Support Team
            </p>
          </div>
        `,
      });

      this.logger.log(`📧 메일 발송 성공 - ${to}: ${info.messageId}`);
      return { success: true, messageId: info.messageId };

    } catch (error) {
      this.logger.error('❌ 메일 발송 실패:', error);
      throw new Error(`메일 발송에 실패했습니다: ${error.message}`);
    }
  }
}
