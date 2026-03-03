# E-commerce Catalog (MongoDB + Mongoose)

Advanced catalog modeling with nested schemas, aggregation pipelines, indexing, and stock management.

## Features

- Nested `variants` and `reviews` subdocuments
- Product-level `avgRating` calculation
- Aggregation APIs:
  - low stock variants by threshold
  - average rating by category
- Indexes for performance and SKU uniqueness
- Stock update method per variant (`set` or `inc`)
- Seed script matching your expected output
- Demo UI at `/` that shows product + aggregation results

## Tech

- Node.js + Express
- MongoDB Atlas + Mongoose
- Vercel-ready serverless config

## API Endpoints

- `GET /health`
- `POST /api/products`
- `GET /api/products`
- `GET /api/products/:id`
- `POST /api/products/:id/reviews`
- `PATCH /api/products/:id/stock`
- `GET /api/analytics/low-stock?threshold=10`
- `GET /api/analytics/category-ratings`

## Local Setup

1. Install dependencies:

```bash
npm install
```

2. Create env file:

```bash
cp .env.example .env
```

3. Add your MongoDB Atlas connection string in `.env`:

```env
MONGODB_URI=your_atlas_connection_string
PORT=5000
```

4. Seed data:

```bash
npm run seed
```

5. Run server:

```bash
npm run dev
```

Open `http://localhost:5000`.

## Expected Output Example

```json
{
  "name": "Premium Headphones",
  "category": "Electronics",
  "variants": [
    {
      "sku": "HP-BL-001",
      "color": "Black",
      "price": 199.99,
      "stock": 15
    },
    {
      "sku": "HP-WH-001",
      "color": "White",
      "price": 209.99,
      "stock": 8
    }
  ],
  "reviews": [
    {
      "userId": "65f4a8b7c1e6a8c1f4b8c7d1",
      "rating": 5,
      "comment": "Excellent sound quality"
    }
  ],
  "avgRating": 5
}
```

## Push to GitHub

```bash
git init
git add .
git commit -m "feat: ecommerce catalog with aggregation and stock management"
git branch -M main
git remote add origin https://github.com/<your-username>/ecommerce-catalog.git
git push -u origin main
```

## Deploy on Vercel

1. Import your GitHub repo into Vercel.
2. Add environment variable:
   - `MONGODB_URI` = your Atlas connection string
3. Deploy.

Your demo link will look like:

- `https://<your-project-name>.vercel.app`

