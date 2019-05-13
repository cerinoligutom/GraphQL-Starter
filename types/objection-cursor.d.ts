export default function index(options: any): any;

export interface ICursorResult<T> {
  pageInfo: {
    next: string;
    previous: string;

    total: number;
    remaining: number;
    hasNext: boolean;
    hasPrevious: boolean;
  };
  results: T[];
}
