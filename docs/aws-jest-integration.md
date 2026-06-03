# Jest + AWS 배포 파이프라인 설명 docs

이 프로젝트는  `pre_build` 단계에서 `pnpm test:unit`을 실행하도록 설정되어 있습니다.

## 동작 방식

1. CodeBuild가 의존성을 설치합니다.
2. `pre_build`에서 Jest 유닛 테스트를 실행합니다.
3. 테스트가 통과하면 `build`에서 Next.js 빌드를 진행합니다.
4. 테스트가 실패하면 배포가 중단됩니다.

## 로컬 확인

```bash
pnpm test:unit
pnpm build
```

## AWS CodePipeline에서 확인할 항목

- CodeBuild 프로젝트가 루트의 `buildspec.yml`을 사용하고 있는지
- Node.js 런타임 버전이 `20`인지
- `pnpm install --frozen-lockfile`가 성공하는지

