# Inventory Artisans Backend API

A RESTful API for the Inventory Artisans application built with Express.js and SQLite.

## Features

- **Products Management**: CRUD operations for product inventory
- **Sales Management**: Create and retrieve sales with items
- **File Upload**: Upload product images
- **SQLite Database**: Lightweight, file-based database
- **CORS Enabled**: Ready for frontend integration

## API Endpoints

### Products
- `GET /api/products` - Get all products
- `POST /api/products` - Create new product
- `PUT /api/products/:id` - Update product
- `DELETE /api/products/:id` - Delete product

### Sales
- `GET /api/sales` - Get all sales with items
- `POST /api/sales` - Create new sale with items

### File Upload
- `POST /api/upload` - Upload product image

### Health Check
- `GET /api/health` - Check API status

## Getting Started

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the development server:
   ```bash
   npm run dev
   ```

3. Start the production server:
   ```bash
   npm start
   ```

The API will be available at `http://localhost:3001/api`

## Database

The application uses SQLite with the following tables:
- `products` - Product inventory
- `sales` - Sales transactions
- `sale_items` - Individual items within sales

The database file (`database.sqlite`) will be created automatically on first run.

## File Uploads

Uploaded images are stored in the `uploads/` directory and served statically at `/uploads/` endpoint.

## Environment Variables

- `PORT` - Server port (default: 3001)
- `NODE_ENV` - Environment (development/production)

