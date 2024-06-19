/**
 * 分页列表
 */
/**
 * paged list of entities.
 * @template T - The type of the entities in the list.
 */
export interface PagedList<T> {
  /**
   * The current page index.
   */
  pageIndex: number;

  /**
   * The number of entities per page.
   */

  pageSize: number;

  /**
   * The total number of entities that can be queried.
   */
  totalCount: number;

  /**
   * The total number of pages.
   */
  totalPages: number;

  /**
   * The list of entities.
   */
  items: T[];

  /**
   * Indicates whether there is a previous page.
   */
  hasPreviousPage: boolean;

  /**
   * Indicates whether there is a next page.
   */
  hasNextPage: boolean;
}
