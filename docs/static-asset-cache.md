# 정적 배포 (캐시 · 문서 지연)

상세한 Lighthouse 항목별 수정 위치·검증 방법은 **[performance-optimization.md](./performance-optimization.md)** 에 통합해 두었습니다.

JS 로드 실패(`Unexpected token '<'`) / 배포 직후 깨짐 → **[cloudfront-static-assets.md](./cloudfront-static-assets.md)** 참고.

## 빠른 참고

- 배포: [`scripts/s3-sync-with-cache.sh`](../scripts/s3-sync-with-cache.sh)
- 기존 S3만 수정: [`scripts/repair-s3-cache-headers.sh`](../scripts/repair-s3-cache-headers.sh)
- CodeBuild env: **`S3_BUCKET`** (또는 `STATIC_SITE_BUCKET` / `KKIUM_S3_BUCKET`)
- deploy 전용: [`buildspec.deploy.yml`](../buildspec.deploy.yml)
- 상세: [performance-optimization.md §1](./performance-optimization.md#1-use-efficient-cache-lifetimes)
