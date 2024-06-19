enum ErrorCode {
  /**
   * 请求成功
   */
  Success = 20000,

  /**
   * 客户端错误，未知错误
   */
  unknownError = -1,

  /**
   * 服务器错误
   */
  ServerError = 50000,

  /**
   * 无效的参数
   */
  InvalidParameter = 40000,

  /**
   * 用户不存在
   */
  UserNotFound = 10001,

  /**
   * 这个账号已经被使用了，请勿重复注册
   */
  UserAlreadyExists = 10002,

  /**
   * 用户名或密码错误
   */
  UsernameOrPasswordIncorrect = 10103,

  /**
   * 生产项目不存在
   */
  ProductionProjectNotFound = 20001,

  /**
   * 生产项目名称冲突，换一个生产项目名称吧
   */
  ProductionProjectAlreadyExists = 20002,

  /**
   * 用户已经拥有这个生产项目了
   */
  UserAlreadyHasProductionProject = 30001,

  /**
   * 登录信息无效或已过期
   */
  InvalidOrExpiredToken = 10104,
}

export default ErrorCode;
