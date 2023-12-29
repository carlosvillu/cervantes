export class UserToken {
  static create({userID, token, createdAt}: {userID: string; token: string; createdAt: number}) {
    if (userID === undefined || token === undefined || createdAt === undefined)
      throw new Error(
        `[UserToken.create] Missing required params userID(${userID}) token(${token}) createdAt(${createdAt})`
      )

    return new UserToken(userID, token, createdAt, false)
  }

  static empty() {
    return new UserToken(undefined, undefined, undefined, true)
  }

  constructor(
    public readonly userID?: string,
    public readonly token?: string,
    public readonly createdAt?: number,
    public readonly empty?: boolean
  ) {}

  isEmpty() {
    return this.empty !== undefined && this.empty
  }
}
