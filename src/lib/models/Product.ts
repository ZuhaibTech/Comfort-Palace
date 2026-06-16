import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  item_code: { type: String, required: true, unique: true },
  hsn_code: { type: String, default: null },
  name: { type: String, required: true },
  description: { type: String, default: null },
  price: { type: Number, required: true },
  cost_price: { type: Number, default: null },
  gst_percentage: { type: Number, default: null },
  profit_percentage: { type: Number, default: null },
  quantity_in_stock: { type: Number, default: 0 },
  low_stock_threshold: { type: Number, default: 10 },
  category: { type: String, default: null },
  image_url: { type: String, default: null },
  is_active: { type: Number, default: 1 },
  archived_at: { type: Date, default: null }
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
  },
  toObject: {
    virtuals: true,
    transform: function (doc, ret) {
      ret.id = ret._id.toString();
      delete ret._id;
      delete ret.__v;
      return ret;
    }
  }
});

export default mongoose.models.Product || mongoose.model('Product', productSchema);
