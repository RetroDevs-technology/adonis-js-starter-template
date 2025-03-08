import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableNames = ['auth_access_tokens']

  async up() {
    this.schema.alterTable(this.tableNames[0], (table) => {
      table
        .string('tokenable_id')
        .defaultTo(this.raw('nanoid()'))
        .notNullable()
        .unsigned()
        .references('id')
        .inTable('users')
        .onDelete('CASCADE')
        .alter()
    })
  }

  async down() {
    this.schema.alterTable(this.tableNames[0], (table) => {
      table.string('tokenable_id').alter()
    })
  }
}
