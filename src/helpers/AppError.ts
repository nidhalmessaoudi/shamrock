export default class AppError extends Error {
  constructor(
    message: string,
    readonly statusCode: number,
    readonly status: "fail" | "error"
  ) {
    super(message);
  }
}
