import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';

export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_SECRET'),
    });
  }

  async vlaidate(payload: any) {
    return {
      userId: payload.user_id,
      code: payload.code,
      name: payload.name,
      email: payload.email,
      lang: payload.lang,
      token: payload.token,
      language: payload.language,
      entityId: payload.entity_id,
      errorMessage: payload.error_message,
    };
  }
}
