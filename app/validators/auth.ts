import vine from '@vinejs/vine'

export const createUserValidator = vine.compile(
  vine.object({
    email: vine.string().email(),
    password: vine.string(),
  }),
)

export const loginValidator = vine.compile(
  vine.object({
    email: vine.string().email(),
    password: vine.string(),
  }),
)

export const verifyOtpValidator = vine.compile(
  vine.object({
    email: vine.string().email(),
    otp: vine.string(),
  }),
)
