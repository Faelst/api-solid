export class UserAlreadyExistsError extends Error {
  constructor(email: string) {
    super(`Email already Exists: ${email}`)
  }
}
