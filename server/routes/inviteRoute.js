const express = require("express");
const router = express.Router();

// Example validation functions (replace these with actual implementations)
function validateInviteCode(code) {
  return true; // Replace with actual logic
}

function checkIfCodeExpired(code) {
  return false; // Replace with actual logic
}

router.get("/", (req, res) => {
  const { code } = req.query;
  const userAgent = req.get("User-Agent");

  // Function to handle error redirects consistently
  const handleErrorRedirect = (reason = "unknown") => {
    const errorDeepLink = `yourapp://invite/error?reason=${reason}`;

    if (/android/i.test(userAgent)) {
      return res.redirect(
        `https://play.google.com/store/apps/details?id=com.yourapp.android&referrer=${encodeURIComponent(
          errorDeepLink
        )}`
      );
    } else if (/iPad|iPhone|iPod/.test(userAgent)) {
      return res.redirect(
        `https://apps.apple.com/app/yourapp?id=yourapp-id&referrer=${encodeURIComponent(
          errorDeepLink
        )}`
      );
    }

    return res.redirect("https://yourwebsite.com/invite-error");
  };

  if (!code) {
    return handleErrorRedirect("missing_code");
  }

  if (!validateInviteCode(code)) {
    return handleErrorRedirect("invalid_code");
  }

  if (checkIfCodeExpired(code)) {
    return handleErrorRedirect("expired_code");
  }

  const deepLink = `yourapp://invite?code=${code}`;

  if (/android/i.test(userAgent)) {
    return res.redirect(
      `https://play.google.com/store/apps/details?id=com.yourapp.android&referrer=${encodeURIComponent(
        deepLink
      )}`
    );
  } else if (/iPad|iPhone|iPod/.test(userAgent)) {
    return res.redirect(
      `https://apps.apple.com/app/yourapp?id=yourapp-id&referrer=${encodeURIComponent(
        deepLink
      )}`
    );
  }

  return handleErrorRedirect("unsupported_platform");
});

module.exports = router;