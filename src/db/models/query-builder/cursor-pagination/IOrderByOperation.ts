export interface IOrderByOperation {
  column: string;
  order: 'asc' | 'desc' | 'ASC' | 'DESC' | undefined;
  property?: string;
}
