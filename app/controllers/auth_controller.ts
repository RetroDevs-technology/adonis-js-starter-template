import User from '#models/user'
import { createUserValidator, loginValidator, verifyOtpValidator } from '#validators/auth'
import Hash from '@adonisjs/core/services/hash'
import type { HttpContext } from '@adonisjs/core/http'
import db from '@adonisjs/lucid/services/db'
import speakeasy from 'speakeasy'

export default class AuthController {
  async register({ request, response, logger }: HttpContext) {
    const payload = await request.validateUsing(createUserValidator)
    const { email, password } = payload

    // Check if user exists
    const existingUser = await User.query().where('email', email).first()

    if (existingUser) {
      return response.conflict({ message: 'User already exists' })
    }

    // Generate OTP secret
    const otpSecret = this.generateOtp()

    const trx = await db.transaction()

    try {
      logger.info('Registering user', { payload })

      // Save new user with transaction
      const newUser = await User.create(
        {
          ...payload,
          email,
          isEmailVerified: false,
          password,
          otpSecret,
        },
        { client: trx },
      )

      //TODO: send otp to user email

      await trx.commit()

      const token = await User.accessTokens.create(newUser)
      return {
        message: 'User registered successfully. Verify OTP to complete registration.',
        accessToken: token.value!.release(),
        user: newUser,
        ...(process.env.NODE_ENV === 'development' && { otp: this.decodeOTP(otpSecret) }),
      }
    } catch (error) {
      await trx.rollback()
      logger.error(error)
      return response.internalServerError({ message: 'Failed to register user' })
    }
  }

  async login({ request, response, logger }: HttpContext) {
    // Validate user input
    const { email, password } = await request.validateUsing(loginValidator)

    try {
      const user = await User.verifyCredentials(email, password)

      if (user) {
        if (!(await Hash.verify(user.password, password))) {
          // Verify password
          return response.badRequest({ message: 'Invalid credentials' })
        }

        // Generate access token
        const token = await User.accessTokens.create(user)

        logger.info('User logged in')

        return { user, accessToken: token.value!.release() }
      }
      return response.notFound('User not found')
    } catch (error) {
      logger.error(error)
      return response.internalServerError({ message: 'Invalid email or password' })
    }
  }

  async logout({ auth }: HttpContext) {
    const user = auth.user

    if (user) {
      await User.accessTokens.delete(user, user.currentAccessToken.identifier)
    }

    return { message: 'Logged out successfully' }
  }

  async getToken({ params }: HttpContext) {
    const user = await User.findOrFail(params.id)
    const token = await User.accessTokens.create(user)

    return { accessToken: token.value!.release() }
  }

  async verifyOtp({ request, response }: HttpContext) {
    const payload = await request.validateUsing(verifyOtpValidator)

    const { email, otp } = payload

    // Find the user by email
    const user = await User.findByOrFail('email', email)

    // Verify OTP
    const isOtpValid = speakeasy.totp.verify({
      secret: user.otpSecret,
      encoding: 'base32',
      token: otp,
      step: 300, // OTP valid for 5 minutes
      window: 1,
    })

    if (!isOtpValid) {
      return response.status(400).json({ message: 'Invalid OTP' })
    }

    // Update the user's email verification status
    user.merge({ isEmailVerified: true })
    await user.save()

    // Generate access token
    const token = await User.accessTokens.create(user)

    return {
      message: 'OTP verified successfully.',
      user: { ...user, accessToken: token.value!.release() },
    }
  }

  generateOtp(): string {
    return speakeasy.generateSecret().base32
  }

  decodeOTP(otpSecret: string): string {
    const otp = speakeasy.totp({
      secret: otpSecret,
      encoding: 'base32',
      step: 300, // 5mins
    })
    return otp
  }
}
