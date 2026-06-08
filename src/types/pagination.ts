export type PageDataURLParams =
  | 'searchCol'
  | 'sortCol'
  | 'sortDir'
  | 'pageSize'
  | 'page'
  | 'q';

export type PageDataOptions = {
  [key in PageDataURLParams]?: string;
};

export type PageDataResponse<T> = {
  items: T[];
  totalItems: number;
  totalPages: number;
};

export type PageItems<T> = {
  pageNumber: number;
  totalItems: number;
  totalPages: number;
  getData: () => Promise<T[]>;
};

export interface TableConfig<
  R = Record<string, unknown>,
  K extends string = Extract<keyof R, string>,
  H = TableHeader<K>,
> {
  row: R;
  keys: K;
  headers: H;
}

export interface TableHeader<V extends string = string> {
  display: string;
  value: V;
  searchable?: boolean;
  sortable?: boolean;
  hidden?: boolean;
}

export type TableHeaderFor<T, K extends string = never> = TableHeader<
  Extract<keyof T, string> | K
>;
