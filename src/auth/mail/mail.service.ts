import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class MailService {
  private transporter: nodemailer.Transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: process.env.MAIL_HOST || 'smtp.gmail.com',
      port: Number(process.env.MAIL_PORT) || 587,
      secure: false,
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
      },
    });
  }

  async sendResetPasswordMail(to: string, token: string) {
    const resetLink = `${process.env.FRONTEND_URL}/auth/reset?token=${token}`;

    const info = await this.transporter.sendMail({
      from: `"LaundryTalk Support" <${process.env.MAIL_USER}>`,
      to,
      subject: '비밀번호 재설정 안내',
      html: `
        <p>비밀번호 재설정을 요청하셨나요?</p>
        <p>아래 버튼을 눌러 새 비밀번호를 설정하세요:</p>
        <a href="${resetLink}" target="_blank"
          style="padding:10px 20px; background:#2563eb; color:white; text-decoration:none; border-radius:5px;">
          비밀번호 재설정
        </a>
        <p>이 링크는 30분 동안만 유효합니다.</p>
      `,
    });

    console.log('📧 메일 발송 완료:', info.messageId);
    return info;
  }
}
