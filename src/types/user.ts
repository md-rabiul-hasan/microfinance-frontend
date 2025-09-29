export type SignInValues = {
  username: string
  password: string
}

export type SessionUser = {
  user_key: string | number
  fullname: string
  user_id: string | number
  user_type: string | number
  assignedBr: string | number
  branch_name: string
  accessToken: string
  refreshToken: string
  accessTokenExpires: number
}
