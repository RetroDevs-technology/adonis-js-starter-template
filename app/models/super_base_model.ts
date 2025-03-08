import { BaseModel, column, computed } from '@adonisjs/lucid/orm'
import type { ModelAttributes, ModelObject } from '@adonisjs/lucid/types/model'
import type { DateTime } from 'luxon'

export default class SuperBaseModel extends BaseModel {
  @computed()
  get isArchived() {
    return !!this.archivedAt
  }

  @column()
  declare metadata: ModelObject

  @column.dateTime()
  declare archivedAt: DateTime | null

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  declare static readonly archive: any

  async mergeMetadata(newMetadata: ModelObject) {
    // Get the existing metadata from the database.
    const existingMetadata = this.metadata || {}
    // Merge the existing and new metadata.
    const mergedMetadata = { ...existingMetadata, ...newMetadata }

    // Update the model's metadata field.
    this.metadata = mergedMetadata
  }
  /**
   * Deep merge the given data with the existing data for the specified field. This method is useful when you want to merge nested objects. For example, if you have a `settings` field in your model that contains nested objects, you can use this method to merge the new settings with the existing settings.
   */
  async deepMerge(fieldName: keyof Partial<ModelAttributes<this>>, newData: ModelObject) {
    // Get the existing data for the given field from the database.
    // @ts-expect-error - We are dynamically accessing the field name here.
    const existingData = this[fieldName] || {}
    // Function to perform deep merging

    const deepMerge = (obj1: ModelObject, obj2: ModelObject): ModelObject => {
      const output: ModelObject = { ...obj1 }
      Object.keys(obj2).forEach((key) => {
        if (obj2[key] instanceof Object && !Array.isArray(obj2[key]) && obj1?.[key]) {
          output[key] = deepMerge(obj1[key], obj2[key])
        } else {
          output[key] = obj2[key]
        }
      })
      return output
    }

    // Merge the existing and new data.
    const mergedData = deepMerge(existingData, newData)

    // Update the model's specified field.
    // @ts-expect-error - We are dynamically accessing the field name here.
    this[fieldName] = mergedData
  }
}
