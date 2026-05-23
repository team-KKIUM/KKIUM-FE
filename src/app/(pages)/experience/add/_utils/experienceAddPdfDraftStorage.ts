import type { PdfMaterial } from '@/app/(pages)/experience/add/_components/ExperienceAddMaterialModal';

const DB_NAME = 'kkium-experience-add';
const DB_VERSION = 1;
const STORE_NAME = 'pdf-draft';
const PDF_DRAFT_KEY = 'selected-pdf';

interface StoredPdfDraft {
  id: string;
  file: File;
  name: string;
  size: number;
}

function openDatabase() {
  return new Promise<IDBDatabase>((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = () => {
      const database = request.result;

      if (!database.objectStoreNames.contains(STORE_NAME)) {
        database.createObjectStore(STORE_NAME);
      }
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

async function runStoreTransaction<T>(
  mode: IDBTransactionMode,
  run: (store: IDBObjectStore) => IDBRequest<T>,
) {
  const database = await openDatabase();

  return new Promise<T>((resolve, reject) => {
    const transaction = database.transaction(STORE_NAME, mode);
    const store = transaction.objectStore(STORE_NAME);
    const request = run(store);
    let result: T;

    request.onsuccess = () => {
      result = request.result;
    };
    request.onerror = () => reject(request.error);
    transaction.oncomplete = () => {
      database.close();
      resolve(result);
    };
    transaction.onerror = () => {
      database.close();
      reject(transaction.error);
    };
    transaction.onabort = () => {
      database.close();
      reject(transaction.error || new Error('IndexedDB transaction aborted.'));
    };
  });
}

export async function saveExperienceAddPdfDraft(pdfMaterial: PdfMaterial) {
  const draft: StoredPdfDraft = {
    id: pdfMaterial.id,
    file: pdfMaterial.file,
    name: pdfMaterial.name,
    size: pdfMaterial.size,
  };

  await runStoreTransaction('readwrite', (store) => store.put(draft, PDF_DRAFT_KEY));
}

export async function getExperienceAddPdfDraft(): Promise<PdfMaterial | null> {
  const draft = await runStoreTransaction<StoredPdfDraft | undefined>('readonly', (store) =>
    store.get(PDF_DRAFT_KEY),
  );

  if (!draft) return null;

  return {
    id: draft.id,
    type: 'pdf',
    file: draft.file,
    name: draft.name,
    size: draft.size,
    status: 'completed',
  };
}

export async function clearExperienceAddPdfDraft() {
  await runStoreTransaction('readwrite', (store) => store.delete(PDF_DRAFT_KEY));
}
