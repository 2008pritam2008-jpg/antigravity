// server/src/utils/apiResponse.js

export class ApiResponse {
  static success(res, data = {}, message = 'Operation completed successfully', statusCode = 200) {
    return res.status(statusCode).json({
      success: true,
      message,
      data,
    });
  }

  static error(res, message = 'An error occurred', code = 'INTERNAL_ERROR', details = [], statusCode = 500) {
    return res.status(statusCode).json({
      success: false,
      message,
      error: {
        code,
        details: Array.isArray(details) ? details : [details],
      },
    });
  }
}
