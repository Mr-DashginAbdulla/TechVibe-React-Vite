const AuditLog = require("../models/AuditLog");

/**
 * Middleware factory that logs admin actions (CREATE, UPDATE, DELETE).
 * Hooks into res.json to capture the result after successful operations.
 *
 * @param {string} resource - The resource type (e.g., "product", "order")
 * @returns {Function} Express middleware
 */
const auditMiddleware = (resource) => {
  return (req, res, next) => {
    // Only log mutating operations
    if (!["POST", "PATCH", "PUT", "DELETE"].includes(req.method)) {
      return next();
    }

    // Determine action from HTTP method
    const actionMap = {
      POST: "CREATE",
      PATCH: "UPDATE",
      PUT: "UPDATE",
      DELETE: "DELETE",
    };
    const action = actionMap[req.method];

    // Hook into res.json to log after successful response
    const originalJson = res.json;
    res.json = function (body) {
      // Only log successful operations (2xx)
      if (res.statusCode >= 200 && res.statusCode < 300 && req.user) {
        const resourceId =
          req.params.id ||
          body?.id ||
          body?._id ||
          "";

        // Build details object (sanitized — never log passwords)
        const details = {};
        if (action === "CREATE" || action === "UPDATE") {
          const sanitizedBody = { ...req.body };
          delete sanitizedBody.password;
          delete sanitizedBody.token;
          details.changes = sanitizedBody;
        }
        if (action === "DELETE") {
          details.deletedResource = resourceId;
        }

        // Create the log entry asynchronously (don't block response)
        AuditLog.create({
          adminId: req.user._id,
          adminEmail: req.user.email,
          action,
          resource,
          resourceId: String(resourceId),
          details,
          ipAddress: req.ip || req.headers["x-forwarded-for"] || "",
          userAgent: req.headers["user-agent"] || "",
        }).catch((err) => {
          console.error("[AuditLog] Failed to create log entry:", err.message);
        });
      }

      originalJson.call(this, body);
    };

    next();
  };
};

module.exports = { auditMiddleware };
