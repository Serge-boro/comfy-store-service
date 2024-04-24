const { Schema, model } = require('mongoose')

const SchemaProduct = new Schema(
  {
    data: {
      type: ['Mixed'],
    },
    meta: {
      pagination: {
        page: {
          type: Number,
        },
        pageSize: {
          type: Number,
        },
        pageCount: {
          type: Number,
        },
        total: {
          type: Number,
        },
      },
      categories: {
        type: [String],
      },
      companies: {
        type: [String],
      },
    },
  },
  {
    toJSON: {
      transform(doc, ret) {
        delete ret._id
        delete ret.__v
      },
    },
  }
)

module.exports = model('Products', SchemaProduct)
