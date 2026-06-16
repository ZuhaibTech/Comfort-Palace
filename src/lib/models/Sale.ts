// @ts-nocheck
import mongoose from 'mongoose';

const saleItemSchema = new mongoose.Schema({
  product_id: { type: String, required: true },
  product_name: { type: String, default: null },
  product_item_code: { type: String, default: null },
  product_image_url: { type: String, default: null },
  quantity: { type: Number, required: true },
  unit_price: { type: Number, required: true },
  total_price: { type: Number, required: true }
}, { _id: true, timestamps: { createdAt: 'created_at', updatedAt: false } });

const saleSchema = new mongoose.Schema({
  sale_number: { type: String, required: true, unique: true },
  customer_name: { type: String, default: null },
  customer_email: { type: String, default: null },
  customer_phone: { type: String, default: null },
  customer_address: { type: String, default: null },
  delivery_address: { type: String, default: null },
  pan_number: { type: String, default: null },
  total_amount: { type: Number, required: true },
  tax_amount: { type: Number, default: 0 },
  discount_amount: { type: Number, default: 0 },
  amount_paid: { type: Number, default: 0 },
  cash_amount: { type: Number, default: 0 },
  upi_amount: { type: Number, default: 0 },
  payment_method: { type: String, default: 'cash' },
  payment_status: { type: String, default: 'pending' },
  notes: { type: String, default: null },
  is_return: { type: Number, default: 0 },
  original_sale_id: { type: String, default: null },
  sale_items: [saleItemSchema]
}, {
  timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
  toJSON: {
    virtuals: true,
    transform: function (doc, ret) {
      ret.id = ret._id.toString();
      delete ret._id;
      delete ret.__v;
      if (ret.sale_items) {
        ret.sale_items = ret.sale_items.map(item => {
          const obj = { ...item };
          if (obj._id) { obj.id = obj._id.toString(); delete obj._id; }
          delete obj.__v;
          return obj;
        });
      }
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

// Helper to generate sale number
saleSchema.statics.generateSaleNumber = function () {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  const time = String(now.getTime()).slice(-6);
  return `SALE-${year}${month}${day}-${time}`;
};

export default mongoose.models.Sale || mongoose.model('Sale', saleSchema);
