export default class TableRow {
  userId: number;
  /**用户名 */
  username: string;
  /**昵称 */
  nickname: string;
  /**所属部门 */
  department: string;
  /**所属课 */
  division: string;
  /**职位 */
  position: string;
  /** 拥有的生产产品的数量 */
  productCount: number;

  constructor(
    userId: number,
    username: string,
    nickname: string,
    department: string,
    division: string,
    position: string,
    productCount: number,
  ) {
    this.userId = userId;
    this.username = username;
    this.nickname = nickname;
    this.department = department;
    this.division = division;
    this.position = position;
    this.productCount = productCount;
  }
}
