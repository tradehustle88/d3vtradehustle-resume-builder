// Firestore CRUD Operations Service
const admin = require("firebase-admin");
const db = admin.firestore();

/**
 * Resume Operations
 */

// Create or update resume
async function saveResume(userId, resumeData) {
  try {
    const resumeRef = resumeData.id ?
      db.collection("resumes").doc(resumeData.id) :
      db.collection("resumes").doc();

    const resume = {
      userId,
      trade: resumeData.trade || null,
      templateId: resumeData.templateId || null,
      personalInfo: resumeData.personalInfo || {},
      experience: resumeData.experience || [],
      skills: resumeData.skills || [],
      certifications: resumeData.certifications || [],
      education: resumeData.education || [],
      summary: resumeData.summary || "",
      atsScore: resumeData.atsScore || 0,
      updatedAt: new Date().toISOString(),
      createdAt: resumeData.id ? resumeData.createdAt : new Date().toISOString(),
    };

    await resumeRef.set(resume, {merge: true});

    return {
      success: true,
      resumeId: resumeRef.id,
      message: "Resume saved successfully",
    };
  } catch (error) {
    console.error("Save Resume Error:", error);
    throw new Error("Failed to save resume");
  }
}

// Get user's resumes
async function getUserResumes(userId, limit = 50) {
  try {
    const snapshot = await db.collection("resumes")
        .where("userId", "==", userId)
        .orderBy("updatedAt", "desc")
        .limit(limit)
        .get();

    const resumes = [];
    snapshot.forEach((doc) => {
      resumes.push({
        id: doc.id,
        ...doc.data(),
      });
    });

    return resumes;
  } catch (error) {
    console.error("Get User Resumes Error:", error);
    throw new Error("Failed to retrieve resumes");
  }
}

// Get single resume
async function getResume(resumeId, userId) {
  try {
    const doc = await db.collection("resumes").doc(resumeId).get();

    if (!doc.exists) {
      throw new Error("Resume not found");
    }

    const resume = doc.data();

    // Verify ownership
    if (resume.userId !== userId) {
      throw new Error("Unauthorized access to resume");
    }

    return {
      id: doc.id,
      ...resume,
    };
  } catch (error) {
    console.error("Get Resume Error:", error);
    throw error;
  }
}

// Delete resume
async function deleteResume(resumeId, userId) {
  try {
    const doc = await db.collection("resumes").doc(resumeId).get();

    if (!doc.exists) {
      throw new Error("Resume not found");
    }

    // Verify ownership
    if (doc.data().userId !== userId) {
      throw new Error("Unauthorized to delete this resume");
    }

    await db.collection("resumes").doc(resumeId).delete();

    return {
      success: true,
      message: "Resume deleted successfully",
    };
  } catch (error) {
    console.error("Delete Resume Error:", error);
    throw error;
  }
}

/**
 * Job Tracker Operations
 */

// Create job entry
async function createJob(userId, jobData) {
  try {
    const jobRef = db.collection("jobs").doc();

    const job = {
      userId,
      company: jobData.company || "",
      position: jobData.position || "",
      location: jobData.location || "",
      salary: jobData.salary || null,
      description: jobData.description || "",
      requirements: jobData.requirements || [],
      status: jobData.status || "applied",
      appliedDate: jobData.appliedDate || new Date().toISOString(),
      notes: jobData.notes || "",
      contactInfo: jobData.contactInfo || {},
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    await jobRef.set(job);

    return {
      success: true,
      jobId: jobRef.id,
      message: "Job created successfully",
    };
  } catch (error) {
    console.error("Create Job Error:", error);
    throw new Error("Failed to create job");
  }
}

// Update job status
async function updateJobStatus(jobId, userId, status, notes = null) {
  try {
    const doc = await db.collection("jobs").doc(jobId).get();

    if (!doc.exists) {
      throw new Error("Job not found");
    }

    // Verify ownership
    if (doc.data().userId !== userId) {
      throw new Error("Unauthorized to update this job");
    }

    const updates = {
      status,
      updatedAt: new Date().toISOString(),
    };

    if (notes) {
      updates.notes = notes;
    }

    await db.collection("jobs").doc(jobId).update(updates);

    return {
      success: true,
      message: "Job status updated",
    };
  } catch (error) {
    console.error("Update Job Status Error:", error);
    throw error;
  }
}

// Get user's jobs
async function getUserJobs(userId, statusFilter = null) {
  try {
    let query = db.collection("jobs")
        .where("userId", "==", userId)
        .orderBy("appliedDate", "desc");

    if (statusFilter) {
      query = query.where("status", "==", statusFilter);
    }

    const snapshot = await query.get();

    const jobs = [];
    snapshot.forEach((doc) => {
      jobs.push({
        id: doc.id,
        ...doc.data(),
      });
    });

    return jobs;
  } catch (error) {
    console.error("Get User Jobs Error:", error);
    throw new Error("Failed to retrieve jobs");
  }
}

// Delete job
async function deleteJob(jobId, userId) {
  try {
    const doc = await db.collection("jobs").doc(jobId).get();

    if (!doc.exists) {
      throw new Error("Job not found");
    }

    if (doc.data().userId !== userId) {
      throw new Error("Unauthorized to delete this job");
    }

    await db.collection("jobs").doc(jobId).delete();

    return {
      success: true,
      message: "Job deleted successfully",
    };
  } catch (error) {
    console.error("Delete Job Error:", error);
    throw error;
  }
}

/**
 * Certification Operations
 */

// Save certification metadata
async function saveCertification(userId, certData) {
  try {
    const certRef = db.collection("certifications").doc();

    const certification = {
      userId,
      name: certData.name || "",
      issuer: certData.issuer || "",
      issueDate: certData.issueDate || null,
      expiryDate: certData.expiryDate || null,
      credentialId: certData.credentialId || "",
      fileUrl: certData.fileUrl || null,
      fileSize: certData.fileSize || 0,
      fileType: certData.fileType || "",
      verified: false,
      createdAt: new Date().toISOString(),
    };

    await certRef.set(certification);

    return {
      success: true,
      certId: certRef.id,
      message: "Certification saved successfully",
    };
  } catch (error) {
    console.error("Save Certification Error:", error);
    throw new Error("Failed to save certification");
  }
}

// Get user's certifications
async function getUserCertifications(userId) {
  try {
    const snapshot = await db.collection("certifications")
        .where("userId", "==", userId)
        .orderBy("issueDate", "desc")
        .get();

    const certifications = [];
    snapshot.forEach((doc) => {
      certifications.push({
        id: doc.id,
        ...doc.data(),
      });
    });

    return certifications;
  } catch (error) {
    console.error("Get User Certifications Error:", error);
    throw new Error("Failed to retrieve certifications");
  }
}

// Delete certification
async function deleteCertificationRecord(certId, userId) {
  try {
    const doc = await db.collection("certifications").doc(certId).get();

    if (!doc.exists) {
      throw new Error("Certification not found");
    }

    if (doc.data().userId !== userId) {
      throw new Error("Unauthorized to delete this certification");
    }

    await db.collection("certifications").doc(certId).delete();

    return {
      success: true,
      message: "Certification deleted successfully",
    };
  } catch (error) {
    console.error("Delete Certification Error:", error);
    throw error;
  }
}

/**
 * Career Blueprint Operations
 */

// Save career blueprint
async function saveBlueprint(userId, blueprintData) {
  try {
    const blueprintRef = blueprintData.id ?
      db.collection("blueprints").doc(blueprintData.id) :
      db.collection("blueprints").doc();

    const blueprint = {
      userId,
      trade: blueprintData.trade || null,
      currentLevel: blueprintData.currentLevel || "apprentice",
      targetLevel: blueprintData.targetLevel || "journeyman",
      milestones: blueprintData.milestones || [],
      completedMilestones: blueprintData.completedMilestones || [],
      estimatedCompletion: blueprintData.estimatedCompletion || null,
      notes: blueprintData.notes || "",
      updatedAt: new Date().toISOString(),
      createdAt: blueprintData.id ? blueprintData.createdAt : new Date().toISOString(),
    };

    await blueprintRef.set(blueprint, {merge: true});

    return {
      success: true,
      blueprintId: blueprintRef.id,
      message: "Blueprint saved successfully",
    };
  } catch (error) {
    console.error("Save Blueprint Error:", error);
    throw new Error("Failed to save blueprint");
  }
}

// Get user's blueprints
async function getUserBlueprints(userId) {
  try {
    const snapshot = await db.collection("blueprints")
        .where("userId", "==", userId)
        .orderBy("updatedAt", "desc")
        .get();

    const blueprints = [];
    snapshot.forEach((doc) => {
      blueprints.push({
        id: doc.id,
        ...doc.data(),
      });
    });

    return blueprints;
  } catch (error) {
    console.error("Get User Blueprints Error:", error);
    throw new Error("Failed to retrieve blueprints");
  }
}

/**
 * Referral Operations
 */

// Create referral
async function createReferral(userId, email) {
  try {
    const referralCode = generateReferralCode(userId);

    const referralRef = db.collection("referrals").doc();

    const referral = {
      userId,
      email,
      referralCode,
      status: "pending",
      rewardEarned: false,
      createdAt: new Date().toISOString(),
    };

    await referralRef.set(referral);

    return {
      success: true,
      referralId: referralRef.id,
      referralCode,
      message: "Referral created successfully",
    };
  } catch (error) {
    console.error("Create Referral Error:", error);
    throw new Error("Failed to create referral");
  }
}

// Get user's referrals
async function getUserReferrals(userId) {
  try {
    const snapshot = await db.collection("referrals")
        .where("userId", "==", userId)
        .orderBy("createdAt", "desc")
        .get();

    const referrals = [];
    snapshot.forEach((doc) => {
      referrals.push({
        id: doc.id,
        ...doc.data(),
      });
    });

    return referrals;
  } catch (error) {
    console.error("Get User Referrals Error:", error);
    throw new Error("Failed to retrieve referrals");
  }
}

// Validate referral code
async function validateReferralCode(code) {
  try {
    const snapshot = await db.collection("referrals")
        .where("referralCode", "==", code)
        .limit(1)
        .get();

    if (snapshot.empty) {
      return {
        valid: false,
        message: "Invalid referral code",
      };
    }

    const referral = snapshot.docs[0].data();

    return {
      valid: true,
      userId: referral.userId,
      message: "Valid referral code",
    };
  } catch (error) {
    console.error("Validate Referral Code Error:", error);
    throw new Error("Failed to validate referral code");
  }
}

/**
 * Helper Functions
 */

// Generate unique referral code
function generateReferralCode(userId) {
  const timestamp = Date.now().toString(36);
  const randomStr = Math.random().toString(36).substring(2, 8);
  const userHash = userId.substring(0, 4);
  return `${userHash}${timestamp}${randomStr}`.toUpperCase();
}

module.exports = {
  // Resume operations
  saveResume,
  getUserResumes,
  getResume,
  deleteResume,

  // Job tracker operations
  createJob,
  updateJobStatus,
  getUserJobs,
  deleteJob,

  // Certification operations
  saveCertification,
  getUserCertifications,
  deleteCertificationRecord,

  // Blueprint operations
  saveBlueprint,
  getUserBlueprints,

  // Referral operations
  createReferral,
  getUserReferrals,
  validateReferralCode,
};
