#!/bin/bash
set -e

# RUN THIS FILE WITH THE COMMAND:  ./triggers/checks/clear_corrupted_node_packages.sh

echo "🗑️ Cleaning corrupted package modules from package-lock.json..."
rm -rf node_modules package-lock.json
npm cache clean --force
npm install
echo "✅ Done!"
