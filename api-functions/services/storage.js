// Cloud Storage Service
const admin = require("firebase-admin");
const bucket = admin.storage().bucket();

/**
 * Storage limits by subscription tier
 */
const storageLimits = {
  "free": {
    maxFileSize: 5 * 1024 * 1024, // 5MB
    maxTotalStorage: 50 * 1024 * 1024, // 50MB
    maxCertifications: 5,
    exportTTL: 1, // 1 day
  },
  "trial": {
    maxFileSize: 10 * 1024 * 1024, // 10MB
    maxTotalStorage: 100 * 1024 * 1024, // 100MB
    maxCertifications: 10,
    exportTTL: 7, // 7 days
  },
  "pro-monthly": {
    maxFileSize: 25 * 1024 * 1024, // 25MB
    maxTotalStorage: 500 * 1024 * 1024, // 500MB
    maxCertifications: 50,
    exportTTL: 30, // 30 days
  },
  "pro-annual": {
    maxFileSize: 25 * 1024 * 1024, // 25MB
    maxTotalStorage: 500 * 1024 * 1024, // 500MB
    maxCertifications: 50,
    exportTTL: 30, // 30 days
  },
};

/**
 * Upload certification document
 */
async function uploadCertification(userId, file, metadata = {}) {
  try {
    const fileName = `users/${userId}/certifications/${Date.now()}_${sanitizeFileName(file.originalname)}`;
    const fileUpload = bucket.file(fileName);

    await fileUpload.save(file.buffer, {
      metadata: {
        contentType: file.mimetype,
        metadata: {
          userId,
          uploadDate: new Date().toISOString(),
          certName: metadata.name || "Unnamed Certificate",
          issuer: metadata.issuer || "",
          ...metadata,
        },
      },
    });

    // Generate signed URL (valid for 7 days)
    const [url] = await fileUpload.getSignedUrl({
      action: "read",
      expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
    });

    return {
      success: true,
      fileUrl: url,
      fileName: fileName,
      fileSize: file.size,
      fileType: file.mimetype,
    };
  } catch (error) {
    console.error("Upload Certification Error:", error);
    throw new Error("Failed to upload certification");
  }
}

/**
 * Save generated resume export (PDF/DOCX)
 */
async function saveResumeExport(userId, resumeId, buffer, format = "pdf", tier = "free") {
  try {
    const extension = format === "pdf" ? "pdf" : "docx";
    const contentType = format === "pdf" ? "application/pdf" : "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
    const fileName = `users/${userId}/exports/${resumeId}_${Date.now()}.${extension}`;
    const fileUpload = bucket.file(fileName);

    await fileUpload.save(buffer, {
      metadata: {
        contentType,
        metadata: {
          userId,
          resumeId,
          generatedAt: new Date().toISOString(),
          format,
        },
      },
    });

    // Set TTL based on subscription tier
    const tierLimits = storageLimits[tier] || storageLimits.free;
    const ttlDays = tierLimits.exportTTL || 1;
    const expiryDate = new Date();
    expiryDate.setDate(expiryDate.getDate() + ttlDays);

    await fileUpload.setMetadata({
      customTime: expiryDate.toISOString(),
    });

    // Generate signed URL
    const [url] = await fileUpload.getSignedUrl({
      action: "read",
      expires: Date.now() + 24 * 60 * 60 * 1000, // 24 hours
    });

    return {
      success: true,
      downloadUrl: url,
      fileName: fileName,
      expiresIn: "24 hours",
      autoDeleteIn: `${ttlDays} days`,
    };
  } catch (error) {
    console.error("Save Export Error:", error);
    throw new Error("Failed to save resume export");
  }
}

/**
 * Get resume template
 */
async function getTemplate(trade, templateId) {
  try {
    const fileName = `templates/${trade}/${templateId}.json`;
    const file = bucket.file(fileName);

    const [exists] = await file.exists();
    if (!exists) {
      throw new Error("Template not found");
    }

    const [contents] = await file.download();
    return JSON.parse(contents.toString());
  } catch (error) {
    console.error("Get Template Error:", error);
    throw new Error("Template not available");
  }
}

/**
 * Delete certification
 */
async function deleteCertification(userId, fileName) {
  try {
    const file = bucket.file(fileName);

    // Verify file exists
    const [exists] = await file.exists();
    if (!exists) {
      throw new Error("File not found");
    }

    // Verify ownership
    const [metadata] = await file.getMetadata();
    if (metadata.metadata && metadata.metadata.userId !== userId) {
      throw new Error("Unauthorized - You do not own this file");
    }

    await file.delete();
    return {success: true, message: "Certification deleted"};
  } catch (error) {
    console.error("Delete Certification Error:", error);
    throw error;
  }
}

/**
 * Get user storage usage
 */
async function getUserStorageUsage(userId) {
  try {
    const [files] = await bucket.getFiles({
      prefix: `users/${userId}/`,
    });

    const totalSize = files.reduce((sum, file) => {
      return sum + parseInt(file.metadata.size || 0);
    }, 0);

    const certFiles = files.filter((f) => f.name.includes("/certifications/"));
    const exportFiles = files.filter((f) => f.name.includes("/exports/"));

    return {
      totalSize,
      totalSizeMB: (totalSize / (1024 * 1024)).toFixed(2),
      certificationCount: certFiles.length,
      exportCount: exportFiles.length,
      fileCount: files.length,
    };
  } catch (error) {
    console.error("Get Storage Usage Error:", error);
    return {
      totalSize: 0,
      totalSizeMB: "0.00",
      certificationCount: 0,
      exportCount: 0,
      fileCount: 0,
    };
  }
}

/**
 * Check storage limits middleware
 */
async function checkStorageLimit(req, res, next) {
  try {
    const userId = req.user.uid;
    const tier = req.user.subscriptionTier || "free";
    const limits = storageLimits[tier];

    // Check file size
    if (req.file && req.file.size > limits.maxFileSize) {
      return res.status(413).json({
        success: false,
        error: "File too large",
        errorId: "STORAGE_FILE_TOO_LARGE",
        maxSize: limits.maxFileSize,
        maxSizeMB: (limits.maxFileSize / (1024 * 1024)).toFixed(2),
        currentSize: req.file.size,
        upgradeUrl: "/pricing",
      });
    }

    // Check total storage
    const usage = await getUserStorageUsage(userId);
    const fileSize = req.file ? req.file.size : 0;
    const newTotal = usage.totalSize + fileSize;

    if (newTotal > limits.maxTotalStorage) {
      return res.status(413).json({
        success: false,
        error: "Storage limit exceeded",
        errorId: "STORAGE_LIMIT_EXCEEDED",
        currentUsage: usage.totalSizeMB,
        limit: (limits.maxTotalStorage / (1024 * 1024)).toFixed(2),
        upgradeUrl: "/pricing",
      });
    }

    // Check certification count
    if (req.path.includes("/certifications")) {
      if (usage.certificationCount >= limits.maxCertifications) {
        return res.status(413).json({
          success: false,
          error: "Certification limit reached",
          errorId: "CERT_LIMIT_REACHED",
          currentCount: usage.certificationCount,
          limit: limits.maxCertifications,
          upgradeUrl: "/pricing",
        });
      }
    }

    next();
  } catch (error) {
    console.error("Storage Limit Check Error:", error);
    next(); // Continue on error to avoid blocking
  }
}

/**
 * Sanitize file name
 */
function sanitizeFileName(fileName) {
  return fileName
      .replace(/[^a-zA-Z0-9.-]/g, "_")
      .replace(/_{2,}/g, "_")
      .substring(0, 100);
}

/**
 * Get signed URL for file
 */
async function getSignedUrl(fileName, expiresInHours = 24) {
  try {
    const file = bucket.file(fileName);
    const [exists] = await file.exists();

    if (!exists) {
      throw new Error("File not found");
    }

    const [url] = await file.getSignedUrl({
      action: "read",
      expires: Date.now() + expiresInHours * 60 * 60 * 1000,
    });

    return url;
  } catch (error) {
    console.error("Get Signed URL Error:", error);
    throw error;
  }
}

/**
 * List user files
 */
async function listUserFiles(userId, folder = "") {
  try {
    const prefix = folder ? `users/${userId}/${folder}/` : `users/${userId}/`;
    const [files] = await bucket.getFiles({prefix});

    return files.map((file) => ({
      name: file.name.split("/").pop(),
      fullPath: file.name,
      size: parseInt(file.metadata.size),
      contentType: file.metadata.contentType,
      created: file.metadata.timeCreated,
      updated: file.metadata.updated,
    }));
  } catch (error) {
    console.error("List Files Error:", error);
    return [];
  }
}

module.exports = {
  uploadCertification,
  saveResumeExport,
  getTemplate,
  deleteCertification,
  getUserStorageUsage,
  checkStorageLimit,
  getSignedUrl,
  listUserFiles,
  storageLimits,
};
