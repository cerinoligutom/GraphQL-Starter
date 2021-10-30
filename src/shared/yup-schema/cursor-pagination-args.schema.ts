/* eslint-disable @typescript-eslint/explicit-module-boundary-types */

import * as yup from 'yup';
import { SortDirection } from '../constants';

export const createCursorPaginationArgsSchema = (sortField: Record<string, string>) => ({
  first: yup.number().required().min(1),
  before: yup.string(),
  after: yup.string().test({
    message: 'Define either "before" or "after" only.',

    test(value: unknown): boolean {
      if (!value) return true;

      return !(value && this.parent.before);
    },
  }),
  sortDirection: yup.string().oneOf(Object.values(SortDirection)).required(),
  sortField: yup.string().oneOf(Object.values(sortField)).required(),
});
