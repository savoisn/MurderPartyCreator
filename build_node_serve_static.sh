#!/usr/bin/env bash
set -euo pipefail

echo "=== Installing backend dependencies ==="
cd backend
pnpm install

echo "=== Installing frontend dependencies ==="
cd ../frontend
pnpm install

echo "=== Building frontend ==="
pnpm build

echo "=== Copying frontend build to backend/dist_front ==="
cd ..
rm -rf backend/dist_front
cp -r frontend/dist backend/dist_front

echo "=== Done ==="
