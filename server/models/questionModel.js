import mongoose from "mongoose";

const questionSchema = mongoose.Schema({
    question:{
        questionText: {
          type: String,
          required: true,
        },
        options: {
            type: [String],
            required: true,
        },
        correctAnswer: {
          type: String,
          required: true,
        },
        marks: {
          type: Number,
          required: true,
        },
    }
})

const questionModel = mongoose.model.questions || mongoose.model('questions',questionSchema)

export default questionModel;