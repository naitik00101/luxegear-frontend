const ERROR_MAP = {
    ValidationError: (err) => ({
        statusCode: 400,
        message: Object.values(err.errors)[0].message,
        errors: Object.values(err.errors).map((e) => e.message),
    }),
    CastError: () => ({
        statusCode: 400,
        message: "Invalid format",
    }),
    JsonWebTokenError: () => ({
        statusCode: 401,
        message: "Invalid token",
    }),
    TokenExpiredError: () => ({
        statusCode: 401,
        message: "Token expired",
    }),
    11000: (err) => {
        const field = Object.keys(err.keyValue)[0];
        return {
            statusCode: 400,
            message: `${field.charAt(0).toUpperCase() + field.slice(1)} already exists`,
        };
    },
};

export const errorHandler = (err, req, res, _next) => {
    console.error(`[Error] ${req.method} ${req.url}: ${err.message}`);

    const handler = ERROR_MAP[err.name] || ERROR_MAP[err.code];
    const { statusCode, message, errors } = handler ? handler(err) : {
        statusCode: err.statusCode || 500,
        message: err.message || "Internal Server Error",
    };

    res.status(statusCode).json({
        success: false,
        message,
        ...(errors && { errors }),
    });
};
