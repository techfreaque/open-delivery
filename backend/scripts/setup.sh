#!/bin/bash

# Install dependencies
npm install

# Create database and run migrations
echo "Creating database and running migrations..."
touch openeats.db

# Seed the database
echo "Seeding the database..."
npm run seed

echo "Setup complete! You can now run 'npm run dev' to start the development server."

