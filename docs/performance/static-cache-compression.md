# Static Resource Cache and Compression

## Header Audit

Date: 2026-06-04
Target: deployed production domain

### `/experience/`

Command:

```bash
curl -I -L https://www.kkium.com/experience/
```

Findings:

- Status: `200`
- Origin/server: `AmazonS3` via `CloudFront`
- `Cache-Control`: missing
- `Content-Encoding`: missing
- `Content-Length`: `18765`
- `x-cache`: `Miss from cloudfront`

### `/experience/add/`

Command:

```bash
curl -I -L https://www.kkium.com/experience/add/
```

Findings:

- Status: `200`
- Origin/server: `AmazonS3` via `CloudFront`
- `Cache-Control`: missing
- `Content-Encoding`: missing
- `Content-Length`: `19054`
- `x-cache`: `Miss from cloudfront`

### JS Chunk

Command:

```bash
curl -I -H 'Accept-Encoding: gzip, br' https://www.kkium.com/_next/static/chunks/0qfvstqmkg-o..js
```

Findings:

- Status: `200`
- `Content-Type`: `application/x-javascript`
- `Cache-Control`: missing
- `Content-Encoding`: missing
- `Content-Length`: `226352`

### CSS Chunk

Command:

```bash
curl -I -H 'Accept-Encoding: gzip, br' https://www.kkium.com/_next/static/chunks/07yk.tnyd8~cx.css
```

Findings:

- Status: `200`
- `Content-Type`: `text/css`
- `Cache-Control`: missing
- `Content-Encoding`: missing
- `Content-Length`: `71121`

### Font

Command:

```bash
curl -I -H 'Accept-Encoding: gzip, br' https://www.kkium.com/_next/static/media/NanumSquareR-s.p.0zryv4ll6ot5o.ttf
```

Findings:

- Status: `200`
- `Content-Type`: `application/octet-stream`
- `Cache-Control`: missing
- `Content-Encoding`: missing
- `Content-Length`: `723640`

### SVG

Command:

```bash
curl -I -H 'Accept-Encoding: gzip, br' https://www.kkium.com/education-default.svg
```

Findings:

- Status: `200`
- `Content-Type`: `image/svg+xml`
- `Cache-Control`: missing
- `Content-Encoding`: missing
- `Content-Length`: `557210`

## Summary

- HTML, JS, CSS, font, and SVG responses do not expose browser cache lifetimes.
- JS, CSS, font, and SVG responses were not compressed even when `Accept-Encoding: gzip, br` was sent.
- Font files are served as `application/octet-stream`, not a font-specific MIME type.
- The response headers match Lighthouse findings for cache lifetime and document request compression issues.

## Next Checks

- Inspect deployment scripts for S3 upload metadata and CloudFront invalidation.
- Confirm whether CloudFront compression is enabled.
- Confirm CloudFront cache policies for HTML and static assets.
- Remove or document `next.config.ts` `headers()` because Next.js warns that it is not applied with `output: 'export'`.

## Repository Deployment Config

`buildspec.yml` currently runs tests and builds the static export:

```yaml
phases:
  build:
    commands:
      - pnpm test:unit
      - pnpm build

artifacts:
  base-directory: out
  files:
    - '**/*'
```

Findings:

- The repository only produces the `out` artifact.
- The repository does not run `aws s3 sync`, set S3 object metadata, or invalidate CloudFront.
- Static resource cache and compression policies are likely controlled by the CodePipeline deploy action, S3 bucket metadata, and CloudFront behavior settings.

## Applied Repository Cleanup

- Removed `next.config.ts` `headers()` because Next.js warns that custom headers are not applied with `output: 'export'`.
- This cleanup removes a misleading config and the static export warning, but does not by itself set deployed cache or compression headers.

## Recommended AWS Settings

Static hashed assets:

- Path pattern: `/_next/static/*`
- Cache-Control: `public, max-age=31536000, immutable`
- Compression: enabled in CloudFront

Public static assets:

- Path patterns: `/*.svg`, `/*.png`, `/*.jpg`, `/*.webp`, `/*.ico`
- Cache-Control: `public, max-age=31536000`
- Compression: enabled for SVG and other compressible text assets

HTML documents:

- Path patterns: `/*.html`, `/`, `/experience/`, `/experience/add/`
- Cache-Control: short-lived or no-cache, for example `public, max-age=0, must-revalidate`
- Invalidate HTML paths on deployment.

Font files:

- Path pattern: `/_next/static/media/*`
- Cache-Control: `public, max-age=31536000, immutable`
- MIME type should be font-specific where possible, for example `font/ttf` for TTF files.
