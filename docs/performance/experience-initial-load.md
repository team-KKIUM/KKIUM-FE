# Experience Initial Load Performance

## Baseline

Date: 2026-06-04

Command:

```bash
pnpm build
```

Source:

```txt
.next/diagnostics/route-bundle-stats.json
```

| Route | First-load JS | Chunks |
| --- | ---: | ---: |
| `/experience` | 1,200,163 bytes (1,172.0 KiB / 1.14 MiB) | 19 |
| `/experience/add` | 1,363,893 bytes (1,331.9 KiB / 1.30 MiB) | 18 |

## Notes

- This baseline is from a local production build.
- Next.js emitted an existing static export warning for `headers` in `next.config.ts`.
- Lighthouse and DevTools measurements should be recorded after serving the production build.

## Lighthouse Baseline

Date: 2026-06-04
Target: deployed production domain
Mode: Desktop

| Route | FCP | LCP | TBT | CLS | Speed Index |
| --- | ---: | ---: | ---: | ---: | ---: |
| `/experience` | 1.5s | 4.9s | 10ms | 0 | 5.3s |
| `/experience/add` | 1.5s | 5.0s | 10ms | 0 | 3.9s |

### `/experience` Insights

- Use efficient cache lifetimes: estimated savings 7,659 KiB.
- Document request latency: server responded slowly, observed 646ms, no compression applied.
- Render-blocking requests: CSS chunk, estimated savings 110ms.
- LCP breakdown: TTFB 650ms, element render delay 4,310ms. LCP element is an experience card title.
- Network dependency tree: maximum critical path latency 1,480ms.

### `/experience/add` Insights

- Use efficient cache lifetimes: estimated savings 6,091 KiB.
- Document request latency: server responded slowly, observed 657ms, no compression applied.
- Render-blocking requests: CSS chunk, estimated savings 50ms.
- Legacy JavaScript: estimated savings 52 KiB.
- LCP breakdown: TTFB 660ms, element render delay 4,360ms. LCP element is a text paragraph.
- Network dependency tree: maximum critical path latency 1,609ms.

## Optimization Candidates

1. Fix cache lifetimes for static assets and generated chunks.
2. Convert large local font files from TTF to WOFF2 where possible.
3. Optimize oversized public SVG assets used in experience cards and shared UI.
4. Split non-initial experience UI, such as detail panels, DnD-only code, material modal, and Notion views.
5. Re-measure Lighthouse after each optimization group.

## After Lazy Loading Non-Initial UI

Date: 2026-06-04

Command:

```bash
pnpm build
```

Source:

```txt
.next/diagnostics/route-bundle-stats.json
```

| Route | Before | After | Change | Chunks |
| --- | ---: | ---: | ---: | ---: |
| `/experience` | 1,200,163 bytes | 1,174,153 bytes | -26,010 bytes | 19 -> 18 |
| `/experience/add` | 1,363,893 bytes | 998,965 bytes | -364,928 bytes | 18 -> 16 |

Changes:

- Lazily load the experience detail panel and detail page content.
- Lazily load the experience add material modal.
- Lazily load non-initial experience add steps after the upload step.

Notes:

- `pnpm build` passed.
- Next.js still emitted the existing static export warning for `headers` in `next.config.ts`.
