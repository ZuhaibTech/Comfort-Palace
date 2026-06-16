import mongoose from 'mongoose';

const contactFormSchema = new mongoose.Schema({
  name: { type: String, required: true },
  phone: { type: String, required: true },
  email: { type: String, required: true },
  requirement: { type: String, required: true }
}, {
  timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
  toJSON: {
    virtuals: true,
    transform: function (doc, ret) {
      ret.id = ret._id.toString();
      delete ret._id;
      delete ret.__v;
      return ret;
    }
  }
});

export default mongoose.models.ContactForm || mongoose.model('ContactForm', contactFormSchema);
