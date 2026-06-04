#!/usr/bin/env bash
# Sync static export (out/) to S3 with Cache-Control and compression for Lighthouse:
# - "Use efficient cache lifetimes"
# - "Document request latency" (gzip + CDN-friendly HTML caching)
#
# Required env: S3_BUCKET
# Optional env: CLOUDFRONT_DISTRIBUTION_ID (invalidates /* after sync)
# Usage: ./scripts/s3-sync-with-cache.sh [out-dir]

set -euo pipefail

OUT_DIR="${1:-out}"
BUCKET="${S3_BUCKET:?Set S3_BUCKET to the target bucket name}"

if [ ! -d "$OUT_DIR" ]; then
  echo "error: directory not found: $OUT_DIR" >&2
  exit 1
fi

LONG_CACHE='public, max-age=31536000, immutable'
# Browser revalidates; CloudFront caches HTML at edge to reduce document TTFB.
HTML_CACHE='public, max-age=0, s-maxage=3600, stale-while-revalidate=86400, must-revalidate'

upload_html() {
  local html_file="$1"
  local rel="${html_file#"$OUT_DIR"/}"

  gzip -9 -c "$html_file" | aws s3 cp - "s3://$BUCKET/$rel" \
    --cache-control "$HTML_CACHE" \
    --content-type "text/html; charset=utf-8" \
    --content-encoding gzip
}

echo "Syncing $OUT_DIR -> s3://$BUCKET"

# 1) Hashed build assets (_next/static) — safe to cache for 1 year
if [ -d "$OUT_DIR/_next/static" ]; then
  aws s3 sync "$OUT_DIR/_next/static" "s3://$BUCKET/_next/static" \
    --delete \
    --cache-control "$LONG_CACHE"
fi

# 2) HTML documents — gzip + short browser / longer edge cache
while IFS= read -r -d '' html_file; do
  upload_html "$html_file"
done < <(find "$OUT_DIR" -type f -name '*.html' -print0)

# 3) Everything else (public SVGs, icons, txt payloads, etc.)
aws s3 sync "$OUT_DIR" "s3://$BUCKET" \
  --delete \
  --exclude '_next/static/*' \
  --exclude '*.html' \
  --cache-control "$LONG_CACHE"

if [ -n "${CLOUDFRONT_DISTRIBUTION_ID:-}" ]; then
  # Invalidate HTML only so hashed _next/static stays warm at the edge (lower document TTFB).
  invalidation_paths=()
  while IFS= read -r -d '' html_file; do
    rel="/${html_file#"$OUT_DIR"/}"
    invalidation_paths+=("$rel")
    if [[ "$rel" == */index.html ]]; then
      invalidation_paths+=("${rel%/index.html}/")
      invalidation_paths+=("${rel%/index.html}")
    fi
  done < <(find "$OUT_DIR" -type f -name '*.html' -print0)

  echo "Creating CloudFront invalidation for ${#invalidation_paths[@]} HTML path(s)"
  aws cloudfront create-invalidation \
    --distribution-id "$CLOUDFRONT_DISTRIBUTION_ID" \
    --paths "${invalidation_paths[@]}" \
    --output text \
    --query 'Invalidation.Id'
fi

echo "S3 sync with cache headers completed."
