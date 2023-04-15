export type ResponseUserFull = {
  id: string;
  firstName: string;
  middleName: string | null;
  lastName: string;
  email: string;
  createdAt: string;
  updatedAt: string;
};

export type ResponseUserSimple = {
  id: string;
};
