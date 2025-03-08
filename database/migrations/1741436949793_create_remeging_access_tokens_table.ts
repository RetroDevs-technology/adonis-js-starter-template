import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableNames = ['auth_access_tokens']

  public async up() {
    for (const tableName of this.tableNames) {
      await this.alterTable(tableName)
    }
  }

  private async alterTable(tableName: string) {
    await this.schema.alterTable(tableName, (table) => {
      // Add new string column
      table.string('new_id').defaultTo(this.raw('nanoid()')).notNullable()
    })

    await this.schema.alterTable(tableName, (table) => {
      // Drop old ID column
      table.dropColumn('id')
      // Rename new column to 'id'
      table.renameColumn('new_id', 'id')
      // Set new column as primary key
      table.primary(['id'])
    })

    console.log(`Migration completed for table: ${tableName}`)
  }

  public async down() {
    for (const tableName of this.tableNames) {
      await this.schema.alterTable(tableName, (table) => {
        table.dropPrimary()
        table.dropColumn('id')
        table.increments('id')
      })
      console.log(`Rollback completed for table: ${tableName}`)
    }
  }
}
