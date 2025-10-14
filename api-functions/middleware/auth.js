// Authentication Middleware
const admin = require('firebase-admin');

/**
 * Verify Firebase ID Token from Authorization header
 */
async function verifyUser(req, res, next) {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        error: 'Unauthorized - No token provided',
        errorId: 'AUTH_NO_TOKEN'
      });
    }

    const idToken = authHeader.split('Bearer ')[1];
    
    try {
      const decodedToken = await admin.auth().verifyIdToken(idToken);
      
      // Fetch user subscription details from Firestore
      const userDoc = await admin.firestore()
        .collection('users')
        .doc(decodedToken.uid)
        .get();
      
      const userData = userDoc.exists ? userDoc.data() : {};
      
      // Attach user info to request
      req.user = {
        uid: decodedToken.uid,
        email: decodedToken.email,
        emailVerified: decodedToken.email_verified,
        role: userData.role || 'user',
        subscriptionTier: userData.subscriptionTier || 'free',
        subscriptionStatus: userData.subscriptionStatus || 'inactive',
        stripeCustomerId: userData.stripeCustomerId
      };
      
      // Update last login
      await admin.firestore()
        .collection('users')
        .doc(decodedToken.uid)
        .set({
          lastLogin: new Date().toISOString(),
          email: decodedToken.email
        }, { merge: true });
      
      next();
    } catch (verifyError) {
      return res.status(401).json({
        success: false,
        error: 'Invalid or expired token',
        errorId: 'AUTH_INVALID_TOKEN',
        details: verifyError.message
      });
    }
  } catch (error) {
    console.error('Auth middleware error:', error);
    return res.status(500).json({
      success: false,
      error: 'Authentication error',
      errorId: 'AUTH_ERROR'
    });
  }
}

/**
 * Role-based access control middleware
 */
function requireRole(...allowedRoles) {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        error: 'Authentication required',
        errorId: 'AUTH_REQUIRED'
      });
    }

    const userRole = req.user.role || 'user';
    const hasAccess = allowedRoles.includes(userRole) || userRole === 'admin';
    
    if (!hasAccess) {
      return res.status(403).json({
        success: false,
        error: 'Insufficient permissions',
        errorId: 'AUTH_INSUFFICIENT_PERMISSIONS',
        required: allowedRoles,
        current: userRole
      });
    }
    
    next();
  };
}

/**
 * Check subscription tier access
 */
function requireSubscription(...allowedTiers) {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        error: 'Authentication required',
        errorId: 'AUTH_REQUIRED'
      });
    }

    const userTier = req.user.subscriptionTier || 'free';
    const hasAccess = allowedTiers.includes(userTier);
    
    if (!hasAccess) {
      return res.status(403).json({
        success: false,
        error: 'Subscription upgrade required',
        errorId: 'SUB_UPGRADE_REQUIRED',
        required: allowedTiers,
        current: userTier,
        upgradeUrl: '/pricing'
      });
    }
    
    // Check if subscription is active
    if (req.user.subscriptionStatus !== 'active') {
      return res.status(403).json({
        success: false,
        error: 'Subscription inactive',
        errorId: 'SUB_INACTIVE',
        current: req.user.subscriptionStatus
      });
    }
    
    next();
  };
}

/**
 * Optional auth - sets req.user if token present but doesn't require it
 */
async function optionalAuth(req, res, next) {
  const authHeader = req.headers.authorization;
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    req.user = null;
    return next();
  }

  try {
    const idToken = authHeader.split('Bearer ')[1];
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    
    const userDoc = await admin.firestore()
      .collection('users')
      .doc(decodedToken.uid)
      .get();
    
    const userData = userDoc.exists ? userDoc.data() : {};
    
    req.user = {
      uid: decodedToken.uid,
      email: decodedToken.email,
      role: userData.role || 'user',
      subscriptionTier: userData.subscriptionTier || 'free',
      subscriptionStatus: userData.subscriptionStatus || 'inactive'
    };
  } catch (error) {
    // Token invalid or expired, continue without user
    req.user = null;
  }
  
  next();
}

module.exports = {
  verifyUser,
  requireRole,
  requireSubscription,
  optionalAuth
};
