#!/bin/bash
urls=(
  "https://www.nailestial.com/en"
  "https://www.nailestial.com/en/collections/back-to-school"
  "https://www.nailestial.com/en/products/celestial-checkerboard"
  "https://www.nailestial.com/en/search"
  "https://www.nailestial.com/en/search?q=nail"
)

for url in "${urls[@]}"; do
  echo "--- Testing $url ---"
  echo "Cold Visit (1):"
  curl -o /dev/null -s -w "  TTFB: %{time_starttransfer}s | Total: %{time_total}s\n" "$url"
  echo "Repeat Visit (2):"
  curl -o /dev/null -s -w "  TTFB: %{time_starttransfer}s | Total: %{time_total}s\n" "$url"
  echo ""
done
