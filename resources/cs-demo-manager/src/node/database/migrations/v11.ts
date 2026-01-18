import { createTrainingWindowsTable } from './create-table/create-training-windows-table';
import type { Migration } from './migration';

const v11: Migration = {
  schemaVersion: 11,
  run: async (transaction) => {
    await createTrainingWindowsTable(transaction);
  },
};

// eslint-disable-next-line no-restricted-syntax
export default v11;
