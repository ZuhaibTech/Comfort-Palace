import mongoose from 'mongoose';

const testimonialSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  rating: { type: Number, required: true, min: 1, max: 5 },
  description: { type: String, required: true },
  status: { type: String, default: 'pending', enum: ['pending', 'approved', 'rejected'] }
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

export default mongoose.models.Testimonial || mongoose.model('Testimonial', testimonialSchema);
