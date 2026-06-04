import { authService } from "../services/authService.js";

export async function login(req, res) {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required.",
      });
    }

    const email = username.trim().toLowerCase();

    if (!authService.isEmailAllowed(email)) {
      return res.status(401).json({
        success: false,
        message: "This email is not authorized to access the system.",
      });
    }

    const smtpValid = await authService.verifySmtpCredentials(email, password);

    if (!smtpValid) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password.",
      });
    }

    const { accessToken, refreshToken } = authService.generateTokens(email);

    await authService.storeSession(accessToken, email, password);

    const { firstName, lastName } = authService.extractNameFromEmail(email);

    res.json({
      success: true,
      data: {
        id: 1,
        username: email,
        email,
        firstName,
        lastName,
        gender: "female",
        image: "",
        role: "admin" ,
        accessToken,
        refreshToken,
        refreshTokenExpiryTime: new Date(
          Date.now() + 7 * 24 * 60 * 60 * 1000
        ).toISOString(),
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({
      success: false,
      message: "An internal error occurred. Please try again later.",
    });
  }
}

export async function logout(req, res) {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader?.startsWith("Bearer ")
      ? authHeader.slice(7)
      : null;

    if (token) {
      await authService.destroySession(token);
    }

    res.json({ success: true, message: "Logged out successfully." });
  } catch {
    res.status(500).json({
      success: false,
      message: "An error occurred during logout.",
    });
  }
}

export async function me(req, res) {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader?.startsWith("Bearer ")
      ? authHeader.slice(7)
      : null;

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Authentication required.",
      });
    }

    const session = await authService.getSession(token);

    if (!session) {
      return res.status(401).json({
        success: false,
        message: "Session expired. Please log in again.",
      });
    }

    const { firstName, lastName } = authService.extractNameFromEmail(
      session.email
    );

    res.json({
      success: true,
      data: {
        id: 1,
        username: session.email,
        email: session.email,
        firstName,
        lastName,
        gender: "female",
        image: "",
        role: "admin",
      },
    });
  } catch {
    res.status(500).json({
      success: false,
      message: "An error occurred.",
    });
  }
}
