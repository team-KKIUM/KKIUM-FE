'use client';

import { useState } from 'react';

import { ExperienceAddMaterialSelectView } from '@/app/experience/add/_components/ExperienceAddMaterialSelectView';
import { ExperienceAddNotionConnectView } from '@/app/experience/add/_components/ExperienceAddNotionConnectView';
import { ModalDescription, ModalTitle } from '@/components/common/Modal';

export function ExperienceAddMaterialModal() {
  const [modalView, setModalView] = useState<'material' | 'notion'>('material');

  return (
    <>
      <ExperienceAddMaterialModalHeader />

      {modalView === 'notion' ? (
        <ExperienceAddNotionConnectView />
      ) : (
        <ExperienceAddMaterialSelectView onNotionConnect={() => setModalView('notion')} />
      )}
    </>
  );
}

function ExperienceAddMaterialModalHeader() {
  return (
    <div className="flex w-full items-start justify-between">
      <div className="flex flex-col gap-0.5">
        <ModalTitle>자료 추가하기</ModalTitle>
        <ModalDescription>자료를 업로드해 경험을 추가할 수 있어요</ModalDescription>
      </div>
    </div>
  );
}
