export type Context = {
  now(): number;
};
type CreateContext = () => Context;
export const createContext: CreateContext = () => ({
  now() {
    return Date.now();
  },
});
