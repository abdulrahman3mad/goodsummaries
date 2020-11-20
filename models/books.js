const { number } = require("@hapi/joi");
const mongoose = require("mongoose");

const bookcoverpath = "uploads/bookscover";

const bookSchema = new mongoose.Schema(
  {
    Title: {
      type: String,
      required: [true, "The title of the book is required (:"]
    },
    Summary: {
      type: String,
      required: true,
    },
    Summarywriter: {
      type: String,
      required: true,
    },
    Category: {
      type: String,
      required: true,
    },
    Coverimage: {
      type: Buffer,
      required: true,
    },
    Coverimagetype: {
      type: String,
      required: true,
    },
    Summaryperson: {
      type: String,
    },

    Whosaveit: [String],

    NumberOfLikes: {
      type: Number,
      default: 0,
    },

  },

  { timestamps: true }
);

bookSchema.virtual("coverimagepath").get(function () {
  if (this.Coverimage != null && this.Coverimagetype != null) {
    return `data:${this.Coverimagetype};charset=utf-8;base64,${this.Coverimage.toString(`base64`)}`
  }
})



const books = mongoose.model("books", bookSchema);
module.exports = books;

