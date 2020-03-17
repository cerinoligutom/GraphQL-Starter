interface ISessionOptions {
  secret: string;
  name: string;
}
export const sessionOptions: ISessionOptions = {
  secret: process.env.SESSION_SECRET! || '535S10N_S5CR3+',
  name: 'sid',
};
