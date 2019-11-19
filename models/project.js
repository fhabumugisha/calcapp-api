const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const ProjectTypes = Object.freeze({
  Budget: "budget",
  Purchase: "purchase",
  Other: "other"
});

const CategoryTypes = Object.freeze({
  Revenue: "revenue",
  Spent: "spent",
  Other: "other"
});

const projectSchema = new Schema(
  {
    type: {
      required: true,
      type: String,
      enum: Object.values(ProjectTypes)
    },
    title: {
      type: String,
      required: true
    },
    description: {
      type: String,
      required: false
    },
    totalAmount: {
      type: Number,
      default: 0
    },
    items: [
      {
        title: {
          type: String,
          required: true
        },
        amount: {
          type: Number,
          default: 0
        }
      }
    ],
    categories: [
      {
        type: {
          required: true,
          type: String,
          enum: Object.values(CategoryTypes)
        },
        title: {
          type: String,
          required: true
        },
        description: {
          type: String,
          required: false
        },
        totalAmount: {
          type: Number,
          default:0 
        },
        items: [
          {
            title: {
              type: String,
              required: true
            },
            amount: {
              type: Number,
              default: 0
            }
          }
        ]
      }
    ],
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true
    }
  },
  { timestamps: true }
);

Object.assign(projectSchema.statics, {
  ProjectTypes,
  CategoryTypes
});

module.exports = mongoose.model("Project", projectSchema);
