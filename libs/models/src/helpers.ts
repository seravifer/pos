export type Optional<T, TRequired extends keyof T> = Partial<T> &
  Pick<T, TRequired>;
