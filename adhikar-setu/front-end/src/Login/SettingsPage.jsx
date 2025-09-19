import React, { useState } from "react";
import {
  Bell,
  Shield,
  Eye,
  EyeOff,
  Key,
  Globe,
  Save,
  X,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import {
  updatePassword,
  reauthenticateWithCredential,
  EmailAuthProvider,
} from "firebase/auth";
import { doc, updateDoc } from "firebase/firestore";
import { auth, db } from "../firebase/config";

const SettingsPage = ({ user, language, onScreenChange }) => {
  const [activeTab, setActiveTab] = useState("notifications");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  // Notification settings
  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    claimUpdates: true,
    approvalRequests: true,
    systemAlerts: false,
  });

  // Privacy settings
  const [privacySettings, setPrivacySettings] = useState({
    profileVisibility: "private",
    showEmail: false,
    showPhone: false,
  });

  // Password change
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  });

  // Language
  const [selectedLanguage, setSelectedLanguage] = useState(language || "en");

  const handleNotificationChange = (key) => {
    setNotificationSettings((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const handlePrivacyChange = (key, value) => {
    setPrivacySettings((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const togglePasswordVisibility = (field) => {
    setShowPasswords((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  const saveNotificationSettings = async () => {
    setLoading(true);
    try {
      await updateDoc(doc(db, "users", user.uid), {
        notificationSettings,
        updatedAt: new Date(),
      });

      setMessage({
        type: "success",
        text:
          language === "en"
            ? "Notification settings saved!"
            : "सूचना सेटिंग्स सहेजी गईं!",
      });
    } catch (error) {
      console.error("Error saving notification settings:", error);
      setMessage({
        type: "error",
        text:
          language === "en"
            ? "Error saving settings. Please try again."
            : "सेटिंग्स सहेजने में त्रुटि। कृपया पुनः प्रयास करें।",
      });
    } finally {
      setLoading(false);
    }
  };

  const savePrivacySettings = async () => {
    setLoading(true);
    try {
      await updateDoc(doc(db, "users", user.uid), {
        privacySettings,
        updatedAt: new Date(),
      });

      setMessage({
        type: "success",
        text:
          language === "en"
            ? "Privacy settings saved!"
            : "गोपनीयता सेटिंग्स सहेजी गईं!",
      });
    } catch (error) {
      console.error("Error saving privacy settings:", error);
      setMessage({
        type: "error",
        text:
          language === "en"
            ? "Error saving settings. Please try again."
            : "सेटिंग्स सहेजने में त्रुटि। कृपया पुनः प्रयास करें।",
      });
    } finally {
      setLoading(false);
    }
  };

  const changePassword = async () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setMessage({
        type: "error",
        text:
          language === "en"
            ? "New passwords do not match."
            : "नए पासवर्ड मेल नहीं खा रहे हैं।",
      });
      return;
    }

    if (passwordData.newPassword.length < 6) {
      setMessage({
        type: "error",
        text:
          language === "en"
            ? "Password must be at least 6 characters."
            : "पासवर्ड कम से कम 6 वर्णों का होना चाहिए।",
      });
      return;
    }

    setLoading(true);
    try {
      const user = auth.currentUser;
      const credential = EmailAuthProvider.credential(
        user.email,
        passwordData.currentPassword
      );

      await reauthenticateWithCredential(user, credential);
      await updatePassword(user, passwordData.newPassword);

      setMessage({
        type: "success",
        text:
          language === "en"
            ? "Password updated successfully!"
            : "पासवर्ड सफलतापूर्वक अपडेट हो गया!",
      });

      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (error) {
      console.error("Error changing password:", error);

      let errorMessage =
        language === "en"
          ? "Error changing password. Please try again."
          : "पासवर्ड बदलने में त्रुटि। कृपया पुनः प्रयास करें।";

      if (error.code === "auth/wrong-password") {
        errorMessage =
          language === "en"
            ? "Current password is incorrect."
            : "वर्तमान पासवर्ड गलत है।";
      }

      setMessage({
        type: "error",
        text: errorMessage,
      });
    } finally {
      setLoading(false);
    }
  };

  const saveLanguageSetting = async () => {
    setLoading(true);
    try {
      await updateDoc(doc(db, "users", user.uid), {
        language: selectedLanguage,
        updatedAt: new Date(),
      });
      setMessage({
        type: "success",
        text:
          selectedLanguage === "en" ? "Language updated!" : "भाषा अपडेट की गई!",
      });
    } catch (error) {
      console.error("Error saving language setting:", error);
      setMessage({
        type: "error",
        text:
          selectedLanguage === "en"
            ? "Error saving language."
            : "भाषा सहेजने में त्रुटि।",
      });
    } finally {
      setLoading(false);
    }
  };

  const tabs = [
    {
      id: "notifications",
      name: language === "en" ? "Notifications" : "सूचनाएं",
      icon: Bell,
    },
    {
      id: "privacy",
      name: language === "en" ? "Privacy" : "गोपनीयता",
      icon: Shield,
    },
    {
      id: "security",
      name: language === "en" ? "Security" : "सुरक्षा",
      icon: Key,
    },
    {
      id: "language",
      name: language === "en" ? "Language" : "भाषा",
      icon: Globe,
    },
  ];

  return (
    <div className="p-4">
      {/* Tabs */}
      <div className="flex space-x-4 border-b pb-2 mb-4">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center space-x-2 px-3 py-1 rounded-md ${
              activeTab === tab.id
                ? "bg-blue-500 text-white"
                : "text-gray-600 hover:bg-gray-100"
            }`}
          >
            <tab.icon size={18} />
            <span>{tab.name}</span>
          </button>
        ))}
      </div>

      {/* Message */}
      {message.text && (
        <div
          className={`flex items-center space-x-2 p-3 mb-4 rounded-md ${
            message.type === "success"
              ? "bg-green-100 text-green-700"
              : "bg-red-100 text-red-700"
          }`}
        >
          {message.type === "success" ? (
            <CheckCircle size={18} />
          ) : (
            <AlertCircle size={18} />
          )}
          <span>{message.text}</span>
          <button onClick={() => setMessage({ type: "", text: "" })}>
            <X size={16} />
          </button>
        </div>
      )}

      {/* Tab Content */}
      {activeTab === "notifications" && (
        <div>
          {Object.keys(notificationSettings).map((key) => (
            <label key={key} className="flex items-center space-x-2 mb-2">
              <input
                type="checkbox"
                checked={notificationSettings[key]}
                onChange={() => handleNotificationChange(key)}
              />
              <span>{key}</span>
            </label>
          ))}
          <button
            onClick={saveNotificationSettings}
            disabled={loading}
            className="mt-3 px-4 py-2 bg-blue-500 text-white rounded-md flex items-center space-x-2"
          >
            <Save size={16} />{" "}
            <span>{language === "en" ? "Save" : "सहेजें"}</span>
          </button>
        </div>
      )}

      {activeTab === "privacy" && (
        <div>
          <label className="block mb-2">
            {language === "en" ? "Profile Visibility:" : "प्रोफ़ाइल दृश्यता:"}
            <select
              value={privacySettings.profileVisibility}
              onChange={(e) =>
                handlePrivacyChange("profileVisibility", e.target.value)
              }
              className="ml-2 border rounded px-2 py-1"
            >
              <option value="private">
                {language === "en" ? "Private" : "निजी"}
              </option>
              <option value="public">
                {language === "en" ? "Public" : "सार्वजनिक"}
              </option>
            </select>
          </label>
          <label className="flex items-center space-x-2 mb-2">
            <input
              type="checkbox"
              checked={privacySettings.showEmail}
              onChange={(e) =>
                handlePrivacyChange("showEmail", e.target.checked)
              }
            />
            <span>{language === "en" ? "Show Email" : "ईमेल दिखाएं"}</span>
          </label>
          <label className="flex items-center space-x-2 mb-2">
            <input
              type="checkbox"
              checked={privacySettings.showPhone}
              onChange={(e) =>
                handlePrivacyChange("showPhone", e.target.checked)
              }
            />
            <span>{language === "en" ? "Show Phone" : "फ़ोन दिखाएं"}</span>
          </label>
          <button
            onClick={savePrivacySettings}
            disabled={loading}
            className="mt-3 px-4 py-2 bg-blue-500 text-white rounded-md flex items-center space-x-2"
          >
            <Save size={16} />{" "}
            <span>{language === "en" ? "Save" : "सहेजें"}</span>
          </button>
        </div>
      )}

      {activeTab === "security" && (
        <div>
          {["currentPassword", "newPassword", "confirmPassword"].map(
            (field) => (
              <div key={field} className="mb-3">
                <label className="block mb-1">
                  {field === "currentPassword"
                    ? language === "en"
                      ? "Current Password"
                      : "वर्तमान पासवर्ड"
                    : field === "newPassword"
                    ? language === "en"
                      ? "New Password"
                      : "नया पासवर्ड"
                    : language === "en"
                    ? "Confirm Password"
                    : "पासवर्ड की पुष्टि करें"}
                </label>
                <div className="relative">
                  <input
                    type={
                      showPasswords[field.replace("Password", "")]
                        ? "text"
                        : "password"
                    }
                    name={field}
                    value={passwordData[field]}
                    onChange={handlePasswordChange}
                    className="border rounded px-3 py-2 w-full"
                  />
                  <button
                    type="button"
                    onClick={() =>
                      togglePasswordVisibility(field.replace("Password", ""))
                    }
                    className="absolute right-2 top-2"
                  >
                    {showPasswords[field.replace("Password", "")] ? (
                      <EyeOff size={18} />
                    ) : (
                      <Eye size={18} />
                    )}
                  </button>
                </div>
              </div>
            )
          )}
          <button
            onClick={changePassword}
            disabled={loading}
            className="mt-3 px-4 py-2 bg-blue-500 text-white rounded-md flex items-center space-x-2"
          >
            <Save size={16} />{" "}
            <span>
              {language === "en" ? "Update Password" : "पासवर्ड अपडेट करें"}
            </span>
          </button>
        </div>
      )}

      {activeTab === "language" && (
        <div>
          <label className="block mb-2">
            {language === "en" ? "Choose Language:" : "भाषा चुनें:"}
          </label>
          <select
            value={selectedLanguage}
            onChange={(e) => setSelectedLanguage(e.target.value)}
            className="border rounded px-2 py-1"
          >
            <option value="en">English</option>
            <option value="hi">हिन्दी</option>
          </select>
          <button
            onClick={saveLanguageSetting}
            disabled={loading}
            className="mt-3 px-4 py-2 bg-blue-500 text-white rounded-md flex items-center space-x-2"
          >
            <Save size={16} />{" "}
            <span>{language === "en" ? "Save" : "सहेजें"}</span>
          </button>
        </div>
      )}
    </div>
  );
};

export default SettingsPage;
