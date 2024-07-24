#!/bin/bash

# Navigate to the repository
cd /home/cybern23/repositories/ot-2.0

# Pull the latest changes
git pull origin main

# Install dependencies
npm install

# Build the project
npm run build

# Copy the built files to the public_html directory
cp -r /home/cybern23/repositories/ot-2.0/dist/* /home/cybern23/public_html/tidalbasinsolutions/