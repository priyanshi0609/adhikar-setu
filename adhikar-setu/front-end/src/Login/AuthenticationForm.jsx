import React, { useState } from "react";
import { Eye, EyeOff, Mail, Lock } from "lucide-react";
import { registerUser, loginUser } from "../firebase/authService";
import colors from "../colors";

const AuthenticationForm = ({ formData, onLogin }) => {
  const { role, language, state, district, village } = formData;
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [credentials, setCredentials] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    name: "",
    phone: "",
    organization: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const getRoleName = () => {
    const roleNames = {
      gram_sabha:
        language === "hi" ? "ग्राम सभा / दावेदार" : "Gram Sabha / Claimant",
      frc: language === "hi" ? "वन अधिकार समिति" : "Forest Rights Committee",
      revenue_officer: language === "hi" ? "राजस्व अधिकारी" : "Revenue Officer",
      sdlc: language === "hi" ? "उप-मंडल समिति" : "Sub-Divisional Committee",
      dlc: language === "hi" ? "जिला स्तरीय समिति" : "District Level Committee",
      slmc:
        language === "hi"
          ? "राज्य स्तरीय निगरानी समिति"
          : "State Level Monitoring Committee",
      mota:
        language === "hi"
          ? "जनजातीय कार्य मंत्रालय"
          : "Ministry of Tribal Affairs",
      ngo: language === "hi" ? "एनजीओ / अनुसंधानकर्ता" : "NGO / Researcher",
    };
    return roleNames[role] || role;
  };

  const handleAuth = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      if (!isLogin) {
        // Registration
        if (credentials.password !== credentials.confirmPassword) {
          throw new Error(
            language === "hi"
              ? "पासवर्ड मैच नहीं कर रहे"
              : "Passwords do not match"
          );
        }

        // Register user with Firebase
        const registrationData = {
          email: credentials.email,
          password: credentials.password,
          role: role,
          language: language,
          state: state,
          district: district,
          village: village,
          name: credentials.name || credentials.email.split("@")[0],
          phone: credentials.phone,
          organization: credentials.organization,
        };

        const result = await registerUser(registrationData);

        if (!result.success) {
          throw new Error(result.error);
        }

        // For roles that don't need approval, log them in immediately
        if (role === "public" || role === "gram_sabha") {
          const loginResult = await loginUser(
            credentials.email,
            credentials.password
          );

          if (!loginResult.success) {
            throw new Error(loginResult.error);
          }

          onLogin(loginResult.user);
        } else {
          // For roles that need approval, show success message
          setError(
            language === "hi"
              ? "पंजीकरण सफल! प्रशासक द्वारा अनुमोदन की प्रतीक्षा करें।"
              : "Registration successful! Please wait for administrator approval."
          );
          setIsLogin(true); // Switch to login form
        }
      } else {
        // Login
        const result = await loginUser(credentials.email, credentials.password);

        if (!result.success) {
          throw new Error(result.error);
        }

        onLogin(result.user);
      }
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  if (role === "public") {
    // Public users don't need authentication
    React.useEffect(() => {
      const publicUser = {
        id: "public_user",
        role: "public",
        language: language,
        name: "Public User",
        isApproved: true,
      };
      onLogin(publicUser);
    }, []);

    return (
      <div
        className="min-h-screen flex items-center justify-center p-4"
        style={{
          background: `linear-gradient(135deg, ${colors.primary[50]} 0%, ${colors.secondary[50]} 100%)`,
        }}
      >
        <div
          className="rounded-2xl p-8 text-center max-w-md"
          style={{
            backgroundColor: colors.background.primary,
            boxShadow: colors.shadow.xl,
          }}
        >
          <div
            className="animate-spin rounded-full h-16 w-16 border-4 mx-auto mb-6"
            style={{
              borderColor: colors.primary[100],
              borderTopColor: colors.primary[600],
            }}
          ></div>
          <div className="space-y-2">
            <h3
              className="text-xl font-semibold"
              style={{ color: colors.text.primary }}
            >
              {language === "hi" ? "प्रतीक्षा करें" : "Please Wait"}
            </h3>
            <p style={{ color: colors.text.secondary }}>
              {language === "hi"
                ? "सार्वजनिक डैशबोर्ड लोड हो रहा है..."
                : "Loading public dashboard..."}
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4"
      style={{
        background: `linear-gradient(135deg, ${colors.primary[50]} 0%, ${colors.background.secondary} 50%, ${colors.secondary[50]} 100%)`,
      }}
    >
      <div className="w-full max-w-md">
        {/* Main Authentication Card */}
        <div
          className="rounded-2xl border overflow-hidden"
          style={{
            backgroundColor: colors.background.primary,
            boxShadow: colors.shadow.xl,
            borderColor: colors.border.light,
          }}
        >
          {/* Header Section */}
          <div
            className="px-8 py-6 text-white"
            style={{
              background: `linear-gradient(135deg, ${colors.primary[600]} 0%, ${colors.secondary[600]} 100%)`,
            }}
          >
            <div className="text-center">
              <div
                className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 backdrop-blur-sm"
                style={{ backgroundColor: "rgba(255, 255, 255, 0.2)" }}
              >
                <Lock className="h-8 w-8 text-white" />
              </div>
              <h2 className="text-2xl font-bold mb-1">
                {language === "hi" ? "प्रमाणीकरण" : "Authentication"}
              </h2>
              <p
                className="text-sm font-medium"
                style={{ color: colors.primary[100] }}
              >
                {getRoleName()}
              </p>
              <p
                className="text-xs mt-1"
                style={{ color: colors.primary[200] }}
              >
                {language === "hi"
                  ? "कृपया अपनी जानकारी दर्ज करें"
                  : "Please enter your credentials"}
              </p>
            </div>
          </div>

          {/* Form Section */}
          <div className="px-8 py-6">
            {/* Auth Toggle */}
            <div
              className="flex mb-6 rounded-xl p-1.5 shadow-inner"
              style={{ backgroundColor: colors.neutral[50] }}
            >
              <button
                onClick={() => setIsLogin(true)}
                className={`flex-1 py-2.5 px-4 rounded-lg text-sm font-semibold transition-all duration-300 ${
                  isLogin ? "transform scale-105" : ""
                }`}
                style={{
                  backgroundColor: isLogin
                    ? colors.background.primary
                    : "transparent",
                  color: isLogin ? colors.primary[700] : colors.text.tertiary,
                  boxShadow: isLogin ? colors.shadow.md : "none",
                }}
              >
                {language === "hi" ? "लॉगिन" : "Sign In"}
              </button>
              <button
                onClick={() => setIsLogin(false)}
                className={`flex-1 py-2.5 px-4 rounded-lg text-sm font-semibold transition-all duration-300 ${
                  !isLogin ? "transform scale-105" : ""
                }`}
                style={{
                  backgroundColor: !isLogin
                    ? colors.background.primary
                    : "transparent",
                  color: !isLogin ? colors.primary[700] : colors.text.tertiary,
                  boxShadow: !isLogin ? colors.shadow.md : "none",
                }}
              >
                {language === "hi" ? "पंजीकरण" : "Sign Up"}
              </button>
            </div>

            <form onSubmit={handleAuth} className="space-y-5">
              {/* Name (for registration only) */}
              {!isLogin && (
                <div className="space-y-2">
                  <label
                    className="block text-sm font-semibold"
                    style={{ color: colors.text.primary }}
                  >
                    {language === "hi" ? "पूरा नाम" : "Full Name"}
                    <span
                      style={{ color: colors.status.error.text }}
                      className="ml-1"
                    >
                      *
                    </span>
                  </label>
                  <input
                    type="text"
                    required
                    value={credentials.name}
                    onChange={(e) =>
                      setCredentials({ ...credentials, name: e.target.value })
                    }
                    className="w-full px-4 py-3.5 border rounded-xl focus:ring-2 transition-all duration-200"
                    style={{
                      backgroundColor: colors.neutral[50],
                      borderColor: colors.border.light,
                      color: colors.text.primary,
                      "--placeholder-color": colors.text.muted,
                    }}
                    onFocus={(e) => {
                      e.target.style.backgroundColor =
                        colors.background.primary;
                      e.target.style.borderColor = colors.primary[500];
                      e.target.style.boxShadow = `0 0 0 2px ${colors.primary[500]}40`;
                    }}
                    onBlur={(e) => {
                      e.target.style.backgroundColor = colors.neutral[50];
                      e.target.style.borderColor = colors.border.light;
                      e.target.style.boxShadow = "none";
                    }}
                    placeholder={
                      language === "hi"
                        ? "आपका पूरा नाम दर्ज करें"
                        : "Enter your full name"
                    }
                  />
                </div>
              )}

              {/* Email */}
              <div className="space-y-2">
                <label
                  className="block text-sm font-semibold"
                  style={{ color: colors.text.primary }}
                >
                  {language === "hi" ? "ईमेल" : "Email"}
                  <span
                    style={{ color: colors.status.error.text }}
                    className="ml-1"
                  >
                    *
                  </span>
                </label>
                <div className="relative">
                  <Mail
                    className="absolute left-4 top-4 h-5 w-5"
                    style={{ color: colors.text.muted }}
                  />
                  <input
                    type="email"
                    required
                    value={credentials.email}
                    onChange={(e) =>
                      setCredentials({ ...credentials, email: e.target.value })
                    }
                    className="w-full pl-12 pr-4 py-3.5 border rounded-xl focus:ring-2 transition-all duration-200"
                    style={{
                      backgroundColor: colors.neutral[50],
                      borderColor: colors.border.light,
                      color: colors.text.primary,
                    }}
                    onFocus={(e) => {
                      e.target.style.backgroundColor =
                        colors.background.primary;
                      e.target.style.borderColor = colors.primary[500];
                      e.target.style.boxShadow = `0 0 0 2px ${colors.primary[500]}40`;
                    }}
                    onBlur={(e) => {
                      e.target.style.backgroundColor = colors.neutral[50];
                      e.target.style.borderColor = colors.border.light;
                      e.target.style.boxShadow = "none";
                    }}
                    placeholder={
                      language === "hi"
                        ? "आपका ईमेल दर्ज करें"
                        : "Enter your email address"
                    }
                  />
                </div>
              </div>

              {/* Password */}
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700">
                  {language === "hi" ? "पासवर्ड" : "Password"}
                  <span className="text-red-500 ml-1">*</span>
                </label>
                <div className="relative">
                  <Lock className="absolute left-4 top-4 h-5 w-5 text-gray-400" />
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    value={credentials.password}
                    onChange={(e) =>
                      setCredentials({
                        ...credentials,
                        password: e.target.value,
                      })
                    }
                    className="w-full pl-12 pr-12 py-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 focus:bg-white transition-all duration-200 text-gray-800 placeholder-gray-400"
                    placeholder={
                      language === "hi"
                        ? "आपका पासवर्ड दर्ज करें"
                        : "Enter your password"
                    }
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-4 text-gray-400 hover:text-gray-600 transition-colors duration-200"
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </button>
                </div>
              </div>

              {/* Confirm Password for Registration */}
              {!isLogin && (
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700">
                    {language === "hi"
                      ? "पासवर्ड की पुष्टि करें"
                      : "Confirm Password"}
                    <span className="text-red-500 ml-1">*</span>
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-4 h-5 w-5 text-gray-400" />
                    <input
                      type={showPassword ? "text" : "password"}
                      required
                      value={credentials.confirmPassword}
                      onChange={(e) =>
                        setCredentials({
                          ...credentials,
                          confirmPassword: e.target.value,
                        })
                      }
                      className="w-full pl-12 pr-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 focus:bg-white transition-all duration-200 text-gray-800 placeholder-gray-400"
                      placeholder={
                        language === "hi"
                          ? "पासवर्ड दोबारा दर्ज करें"
                          : "Confirm your password"
                      }
                    />
                  </div>
                </div>
              )}

              {/* Phone and Organization (for registration only) */}
              {!isLogin && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-700">
                      {language === "hi" ? "फोन नंबर" : "Phone Number"}
                    </label>
                    <input
                      type="tel"
                      value={credentials.phone}
                      onChange={(e) =>
                        setCredentials({
                          ...credentials,
                          phone: e.target.value,
                        })
                      }
                      className="w-full px-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 focus:bg-white transition-all duration-200 text-gray-800 placeholder-gray-400"
                      placeholder={
                        language === "hi" ? "+91 फोन नंबर" : "+91 Phone number"
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-700">
                      {language === "hi" ? "संगठन" : "Organization"}
                    </label>
                    <input
                      type="text"
                      value={credentials.organization}
                      onChange={(e) =>
                        setCredentials({
                          ...credentials,
                          organization: e.target.value,
                        })
                      }
                      className="w-full px-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 focus:bg-white transition-all duration-200 text-gray-800 placeholder-gray-400"
                      placeholder={
                        language === "hi" ? "संगठन का नाम" : "Organization name"
                      }
                    />
                  </div>
                </div>
              )}

              {/* Error Message */}
              {error && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-xl">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-red-500 rounded-full flex-shrink-0"></div>
                    <p className="text-sm text-red-800 font-medium">{error}</p>
                  </div>
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 rounded-xl font-semibold disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 text-white"
                style={{
                  background: `linear-gradient(135deg, ${colors.primary[600]} 0%, ${colors.secondary[600]} 100%)`,
                }}
                onMouseEnter={(e) => {
                  if (!loading) {
                    e.target.style.background = `linear-gradient(135deg, ${colors.primary[700]} 0%, ${colors.secondary[700]} 100%)`;
                  }
                }}
                onMouseLeave={(e) => {
                  if (!loading) {
                    e.target.style.background = `linear-gradient(135deg, ${colors.primary[600]} 0%, ${colors.secondary[600]} 100%)`;
                  }
                }}
              >
                {loading ? (
                  <div className="flex items-center space-x-2">
                    <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                    <span>
                      {language === "hi"
                        ? "कृपया प्रतीक्षा करें..."
                        : "Please wait..."}
                    </span>
                  </div>
                ) : language === "hi" ? (
                  isLogin ? (
                    "लॉगिन करें"
                  ) : (
                    "पंजीकरण करें"
                  )
                ) : isLogin ? (
                  "Sign In"
                ) : (
                  "Sign Up"
                )}
              </button>
            </form>
          </div>
        </div>

        {/* Location Summary Card */}
        <div
          className="mt-6 rounded-xl border overflow-hidden"
          style={{
            backgroundColor: colors.background.primary,
            boxShadow: colors.shadow.lg,
            borderColor: colors.border.light,
          }}
        >
          <div
            className="px-6 py-4 border-b"
            style={{
              background: `linear-gradient(135deg, ${colors.neutral[50]} 0%, ${colors.primary[50]} 100%)`,
              borderBottomColor: colors.border.light,
            }}
          >
            <h4
              className="font-bold flex items-center space-x-2"
              style={{ color: colors.text.primary }}
            >
              <div
                className="w-2 h-2 rounded-full"
                style={{ backgroundColor: colors.primary[500] }}
              ></div>
              <span>
                {language === "hi" ? "चयनित जानकारी" : "Selected Information"}
              </span>
            </h4>
          </div>
          <div className="px-6 py-4">
            <div className="space-y-3">
              <div
                className="flex justify-between items-center py-2 border-b"
                style={{ borderBottomColor: colors.neutral[100] }}
              >
                <span
                  className="font-semibold text-sm"
                  style={{ color: colors.text.secondary }}
                >
                  {language === "hi" ? "भूमिका:" : "Role:"}
                </span>
                <span
                  className="font-semibold text-sm"
                  style={{ color: colors.primary[700] }}
                >
                  {getRoleName()}
                </span>
              </div>
              <div
                className="flex justify-between items-center py-2 border-b"
                style={{ borderBottomColor: colors.neutral[100] }}
              >
                <span
                  className="font-semibold text-sm"
                  style={{ color: colors.text.secondary }}
                >
                  {language === "hi" ? "भाषा:" : "Language:"}
                </span>
                <span
                  className="font-medium text-sm"
                  style={{ color: colors.text.primary }}
                >
                  {language === "hi" ? "हिंदी" : "English"}
                </span>
              </div>
              {state && (
                <div
                  className="flex justify-between items-center py-2 border-b"
                  style={{ borderBottomColor: colors.neutral[100] }}
                >
                  <span
                    className="font-semibold text-sm"
                    style={{ color: colors.text.secondary }}
                  >
                    {language === "hi" ? "राज्य:" : "State:"}
                  </span>
                  <span
                    className="font-medium text-sm"
                    style={{ color: colors.text.primary }}
                  >
                    {state}
                  </span>
                </div>
              )}
              {district && (
                <div
                  className="flex justify-between items-center py-2 border-b"
                  style={{ borderBottomColor: colors.neutral[100] }}
                >
                  <span
                    className="font-semibold text-sm"
                    style={{ color: colors.text.secondary }}
                  >
                    {language === "hi" ? "जिला:" : "District:"}
                  </span>
                  <span
                    className="font-medium text-sm"
                    style={{ color: colors.text.primary }}
                  >
                    {district}
                  </span>
                </div>
              )}
              {village && (
                <div className="flex justify-between items-center py-2">
                  <span
                    className="font-semibold text-sm"
                    style={{ color: colors.text.secondary }}
                  >
                    {language === "hi" ? "गांव:" : "Village:"}
                  </span>
                  <span
                    className="font-medium text-sm"
                    style={{ color: colors.text.primary }}
                  >
                    {village}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthenticationForm;
