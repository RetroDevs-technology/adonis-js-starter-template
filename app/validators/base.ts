import type { HttpContext } from '@adonisjs/core/http'
import vine from '@vinejs/vine'

export const baseValidatorMessages = {
  'minLength': '{{ field }} must be at least {{ options.minLength }} characters long',
  'maxLength': '{{ field }} must be less then {{ options.maxLength }} characters long',
  'required': '{{ field }} is required',
  'email': '{{ field }} must be a valid email',
  'notIn': 'This value is not allowed for {{ field }}',
  'unique':
    'There is already a user associated with this {{ field }} please use a different {{ field }}',
  'exists': 'This {{ field }} already exists',
  'enum': '{{ field }} must be one of {{ options.choices }}',
  'requiredWhen': '{{ field }} is required when {{ otherField }} {{ operator }} {{ values }}',
  'file.size': 'The file size must be under {{ options.size }}',
  'file.extname': 'The upload file should be {{ options.extnames }}',
  'string': '{{ field }} must be a string',
}

export default class BaseValidator {
  constructor(protected ctx: HttpContext) {}

  vine = vine.compile(vine.object({}))

  // vine.messagesProvider = new SimpleMessagesProvider(baseValidatorMessages)
}
