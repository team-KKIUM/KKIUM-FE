import { applyJobAnalysisMockData } from '../../_constants/applyMockData';
import { ApplyFitScore } from './ApplyFitScore';
import { ApplyJobInfo } from './ApplyJobInfo';
import { ApplyJobTags } from './ApplyJobTags';
import { ApplySectionHeader } from './ApplySectionHeader';
import { ApplyText } from './ApplyText';

export function ApplyAnalysis() {
  return (
    <section className="flex w-full flex-col gap-8">
      <ApplySectionHeader title="공고 분석" infoVariant="job-analysis" />

      <ApplyFitScore value={applyJobAnalysisMockData.fitScore} />

      <ApplyJobInfo {...applyJobAnalysisMockData.jobInfo} />

      <ApplyJobTags
        skills={applyJobAnalysisMockData.tags.skills}
        competencies={applyJobAnalysisMockData.tags.competencies}
      />

      <div className="mb-9 flex w-full flex-col gap-6">
        {applyJobAnalysisMockData.sections.map((section) => (
          <ApplyText key={section.title} title={section.title} items={section.items} />
        ))}
      </div>
    </section>
  );
}
