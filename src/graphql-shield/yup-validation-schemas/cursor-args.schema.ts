import * as yup from 'yup';

export const cursorArgsSchema = yup.object().shape({
  first: yup.number().required().min(0),
  before: yup.string(),
  after: yup.string().test({
    message: `Define either 'before' or 'after' only.`,
    test(value: string) {
      if (!value) return true;

      return !(value && this.parent.before);
    },
  }),
});
