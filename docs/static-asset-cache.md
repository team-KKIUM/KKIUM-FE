# 정적 배포 (캐시 · 문서 지연)

상세한 Lighthouse 항목별 수정 위치·검증 방법은 **[performance-optimization.md](./performance-optimization.md)** 에 통합해 두었습니다.

## 빠른 참고

- 배포 스크립트: [`scripts/s3-sync-with-cache.sh`](../scripts/s3-sync-with-cache.sh)
- CodeBuild: `S3_BUCKET`, 선택 `CLOUDFRONT_DISTRIBUTION_ID`
- 로컬: `export S3_BUCKET=... && ./scripts/s3-sync-with-cache.sh out`
