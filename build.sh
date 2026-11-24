#!/bin/sh
# Builds chrome/, firefox/, edge/ from the shared source in the repo root.
# Run: sh build.sh   (zips are written to dist/, which is git-ignored)
set -e
cd "$(dirname "$0")"
SRC="content.js content.css popup.js popup.html popup.css"
rm -rf chrome edge firefox dist; mkdir -p dist
for t in chrome edge firefox; do
  mkdir "$t"; cp $SRC "$t"/; cp -r icons "$t"/
  if [ "$t" = firefox ]; then cp manifest.firefox.json firefox/manifest.json; else cp manifest.json "$t"/manifest.json; fi
  (cd "$t" && zip -qr "../dist/untouch-flow-$t.zip" . -x '.DS_Store')
done
echo "built: chrome/ edge/ firefox/ + dist/*.zip"
