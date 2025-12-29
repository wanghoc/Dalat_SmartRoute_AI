# Dalat SmartRoute AI

## Overview
A smart routing solution for Dalat using AI-powered optimization.

## Features
- Intelligent route planning
- Real-time optimization
- AI-driven recommendations

## Getting Started
1. Clone the repository
2. Install dependencies
3. Configure settings
4. Run the application

## Usage
```bash
npm start
```

## Contributing
Pull requests welcome!

## Run the project
# Run client
cd client
npm install (1st time)
npm run dev

# Run Prisma
cd server
npx prisma generate
npx prisma db push
npm run db:seed
(1st time)
npx prisma studios

# Run server
cd server
npm install (1st time)
npm run dev

# Test raining Weather
http://localhost:3001/api/places/weather-recommendations?weatherId=500&limit=6