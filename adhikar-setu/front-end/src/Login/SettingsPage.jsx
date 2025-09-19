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
import { auth, db } from "../firebase/firebase.js";

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

      // Reauthenticate user
      await reauthenticateWithCredential(user, credential);

      // Update password
      await updatePassword(user, passwordData.newPassword);

      setMessage({
        type: "success",
        text:
          language === "en"
            ? "Password updated successfully!"
            : "पासवर्ड सफलतापूर्वक अपडेट हो गया!",
      });

      // Reset form
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
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-green-600 to-green-700 p-6 text-white">
          <h1 className="text-2xl font-bold">
            {language === "en" ? "Settings" : "सेटिंग्स"}
          </h1>
          <p className="text-green-100">
            {language === "en"
              ? "Customize your application preferences"
              : "अपनी एप्लिकेशन प्राथमिकताएं अनुकूलित करें"}
          </p>
        </div>

        {/* Message Alert */}
        {message.text && (
          <div
            className={`p-4 mx-6 mt-6 rounded-lg ${
              message.type === "success"
                ? "bg-green-100 text-green-800 border border-green-200"
                : "bg-red-100 text-red-800 border border-red-200"
            }`}
          >
            <div className="flex items-center">
              {message.type === "success" ? (
                <CheckCircle className="h-5 w-5 mr-2" />
              ) : (
                <AlertCircle className="h-5 w-5 mr-2" />
              )}
              {message.text}
            </div>
          </div>
        )}

        {/* Tabs */}
        <div className="border-b border-gray-200">
          <nav className="flex overflow-x-auto -mb-px">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
                    activeTab === tab.id
                      ? "border-green-500 text-green-600"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }`}
                >
                  <Icon className="h-4 w-4 mr-2" />
                  {tab.name}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Tab Content */}
        <div className="p-6">
          {/* Notifications Tab */}
          {activeTab === "notifications" && (
            <div>
              <h2 className="text-lg font-semibold text-gray-800 mb-4">
                {language === "en"
                  ? "Notification Preferences"
                  : "सूचना वरीयताएं"}
              </h2>

              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <h3 className="font-medium text-gray-800">
                      {language === "en"
                        ? "Email Notifications"
                        : "ईमेल सूचनाएं"}
                    </h3>
                    <p className="text-sm text-gray-600">
                      {language === "en"
                        ? "Receive important updates via email"
                        : "ईमेल के माध्यम से महत्वपूर्ण अपडेट प्राप्त करें"}
                    </p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={notificationSettings.emailNotifications}
                      onChange={() =>
                        handleNotificationChange("emailNotifications")
                      }
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
                  </label>
                </div>

                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <h3 className="font-medium text-gray-800">
                      {language === "en"
                        ? "Claim Status Updates"
                        : "दावा स्थिति अपडेट"}
                    </h3>
                    <p className="text-sm text-gray-600">
                      {language === "en"
                        ? "Get notified when your claim status changes"
                        : "अपने दावा की स्थिति बदलने पर सूचित किया जाए"}
                    </p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={notificationSettings.claimUpdates}
                      onChange={() => handleNotificationChange("claimUpdates")}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
                  </label>
                </div>

                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <h3 className="font-medium text-gray-800">
                      {language === "en"
                        ? "Approval Requests"
                        : "अनुमोदन अनुरोध"}
                    </h3>
                    <p className="text-sm text-gray-600">
                      {language === "en"
                        ? "Notifications for claims requiring your approval"
                        : "आपके अनुमोदन की आवश्यकता वाले दावों के लिए सूचनाएं"}
                    </p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={notificationSettings.approvalRequests}
                      onChange={() =>
                        handleNotificationChange("approvalRequests")
                      }
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
                  </label>
                </div>

                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <h3 className="font-medium text-gray-800">
                      {language === "en" ? "System Alerts" : "सिस्टम अलर्ट"}
                    </h3>
                    <p className="text-sm text-gray-600">
                      {language === "en"
                        ? "Important system maintenance and update notifications"
                        : "महत्वपूर्ण सिस्टम रखरखाव और अद्यतन सूचनाएं"}
                    </p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={notificationSettings.systemAlerts}
                      onChange={() => handleNotificationChange("systemAlerts")}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
                  </label>
                </div>
              </div>

              <div className="mt-6 flex justify-end">
                <button
                  onClick={saveNotificationSettings}
                  disabled={loading}
                  className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 transition-colors"
                >
                  <Save className="h-4 w-4 mr-2" />
                  {loading
                    ? language === "en"
                      ? "Saving..."
                      : "सहेज रहे हैं..."
                    : language === "en"
                    ? "Save Changes"
                    : "परिवर्तन सहेजें"}
                </button>
              </div>
            </div>
          )}

          {/* Privacy Tab */}
          {activeTab === "privacy" && (
            <div>
              <h2 className="text-lg font-semibold text-gray-800 mb-4">
                {language === "en" ? "Privacy Settings" : "गोपनीयता सेटिंग्स"}
              </h2>

              <div className="space-y-6">
                <div className="p-4 bg-gray-50 rounded-lg">
                  <h3 className="font-medium text-gray-800 mb-3">
                    {language === "en"
                      ? "Profile Visibility"
                      : "प्रोफाइल दृश्यता"}
                  </h3>
                  <div className="space-y-3">
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="profileVisibility"
                        value="public"
                        checked={privacySettings.profileVisibility === "public"}
                        onChange={() =>
                          handlePrivacyChange("profileVisibility", "public")
                        }
                        className="text-green-600 focus:ring-green-500"
                      />
                      <span className="ml-2 text-gray-700">
                        {language === "en"
                          ? "Public - Anyone can see my profile"
                          : "सार्वजनिक - कोई भी मेरी प्रोफाइल देख सकता है"}
                      </span>
                    </label>

                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="profileVisibility"
                        value="private"
                        checked={
                          privacySettings.profileVisibility === "private"
                        }
                        onChange={() =>
                          handlePrivacyChange("profileVisibility", "private")
                        }
                        className="text-green-600 focus:ring-green-500"
                      />
                      <span className="ml-2 text-gray-700">
                        {language === "en"
                          ? "Private - Only approved users can see my profile"
                          : "निजी - केवल अनुमोदित उपयोगकर्ता ही मेरी प्रोफाइल देख सकते हैं"}
                      </span>
                    </label>
                  </div>
                </div>

                <div className="p-4 bg-gray-50 rounded-lg">
                  <h3 className="font-medium text-gray-800 mb-3">
                    {language === "en"
                      ? "Contact Information"
                      : "संपर्क जानकारी"}
                  </h3>
                  <div className="space-y-3">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={privacySettings.showEmail}
                        onChange={() =>
                          handlePrivacyChange(
                            "showEmail",
                            !privacySettings.showEmail
                          )
                        }
                        className="text-green-600 focus:ring-green-500 rounded"
                      />
                      <span className="ml-2 text-gray-700">
                        {language === "en"
                          ? "Show my email address to other users"
                          : "अन्य उपयोगकर्ताओं को मेरा ईमेल पता दिखाएं"}
                      </span>
                    </label>

                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={privacySettings.showPhone}
                        onChange={() =>
                          handlePrivacyChange(
                            "showPhone",
                            !privacySettings.showPhone
                          )
                        }
                        className="text-green-600 focus:ring-green-500 rounded"
                      />
                      <span className="ml-2 text-gray-700">
                        {language === "en"
                          ? "Show my phone number to other users"
                          : "अन्य उपयोगकर्ताओं को मेरा फोन नंबर दिखाएं"}
                      </span>
                    </label>
                  </div>
                </div>
              </div>

              <div className="mt-6 flex justify-end">
                <button
                  onClick={savePrivacySettings}
                  disabled={loading}
                  className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 transition-colors"
                >
                  <Save className="h-4 w-4 mr-2" />
                  {loading
                    ? language === "en"
                      ? "Saving..."
                      : "सहेज रहे हैं..."
                    : language === "en"
                    ? "Save Changes"
                    : "परिवर्तन सहेजें"}
                </button>
              </div>
            </div>
          )}

          {/* Security Tab */}
          {activeTab === "security" && (
            <div>
              <h2 className="text-lg font-semibold text-gray-800 mb-4">
                {language === "en" ? "Security Settings" : "सुरक्षा सेटिंग्स"}
              </h2>

              <div className="bg-gray-50 p-6 rounded-lg">
                <h3 className="font-medium text-gray-800 mb-4">
                  {language === "en" ? "Change Password" : "पासवर्ड बदलें"}
                </h3>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {language === "en"
                        ? "Current Password"
                        : "वर्तमान पासवर्ड"}
                    </label>
                    <div className="relative">
                      <input
                        type={showPasswords.current ? "text" : "password"}
                        name="currentPassword"
                        value={passwordData.currentPassword}
                        onChange={handlePasswordChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500 pr-10"
                        placeholder={
                          language === "en"
                            ? "Enter current password"
                            : "वर्तमान पासवर्ड दर्ज करें"
                        }
                      />
                      <button
                        type="button"
                        onClick={() => togglePasswordVisibility("current")}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                      >
                        {showPasswords.current ? (
                          <EyeOff className="h-5 w-5" />
                        ) : (
                          <Eye className="h-5 w-5" />
                        )}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {language === "en" ? "New Password" : "नया पासवर्ड"}
                    </label>
                    <div className="relative">
                      <input
                        type={showPasswords.new ? "text" : "password"}
                        name="newPassword"
                        value={passwordData.newPassword}
                        onChange={handlePasswordChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500 pr-10"
                        placeholder={
                          language === "en"
                            ? "Enter new password"
                            : "नया पासवर्ड दर्ज करें"
                        }
                      />
                      <button
                        type="button"
                        onClick={() => togglePasswordVisibility("new")}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                      >
                        {showPasswords.new ? (
                          <EyeOff className="h-5 w-5" />
                        ) : (
                          <Eye className="h-5 w-5" />
                        )}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {language === "en"
                        ? "Confirm New Password"
                        : "नए पासवर्ड की पुष्टि करें"}
                    </label>
                    <div className="relative">
                      <input
                        type={showPasswords.confirm ? "text" : "password"}
                        name="confirmPassword"
                        value={passwordData.confirmPassword}
                        onChange={handlePasswordChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500 pr-10"
                        placeholder={
                          language === "en"
                            ? "Confirm new password"
                            : "नए पासवर्ड की पुष्टि करें"
                        }
                      />
                      <button
                        type="button"
                        onClick={() => togglePasswordVisibility("confirm")}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                      >
                        {showPasswords.confirm ? (
                          <EyeOff className="h-5 w-5" />
                        ) : (
                          <Eye className="h-5 w-5" />
                        )}
                      </button>
                    </div>
                  </div>
                </div>

                <div className="mt-6 flex justify-end">
                  <button
                    onClick={changePassword}
                    disabled={loading}
                    className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 transition-colors"
                  >
                    <Key className="h-4 w-4 mr-2" />
                    {loading
                      ? language === "en"
                        ? "Updating..."
                        : "अपडेट हो रहा है..."
                      : language === "en"
                      ? "Update Password"
                      : "पासवर्ड अपडेट करें"}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Language Tab */}
          {activeTab === "language" && (
            <div>
              <h2 className="text-lg font-semibold text-gray-800 mb-4">
                {language === "en" ? "Language Preferences" : "भाषा वरीयताएं"}
              </h2>

              <div className="bg-gray-50 p-6 rounded-lg">
                <div className="space-y-4">
                  <label className="flex items-center p-4 border border-gray-300 rounded-lg cursor-pointer hover:bg-green-50 transition-colors">
                    <input
                      type="radio"
                      name="language"
                      value="en"
                      checked={user.language === "en"}
                      onChange={() => {}}
                      className="text-green-600 focus:ring-green-500"
                    />
                    <div className="ml-3">
                      <span className="block text-sm font-medium text-gray-900">
                        English
                      </span>
                      <span className="block text-sm text-gray-500">
                        Use the application in English
                      </span>
                    </div>
                  </label>

                  <label className="flex items-center p-4 border border-gray-300 rounded-lg cursor-pointer hover:bg-green-50 transition-colors">
                    <input
                      type="radio"
                      name="language"
                      value="hi"
                      checked={user.language === "hi"}
                      onChange={() => {}}
                      className="text-green-600 focus:ring-green-500"
                    />
                    <div className="ml-3">
                      <span className="block text-sm font-medium text-gray-900">
                        हिंदी
                      </span>
                      <span className="block text-sm text-gray-500">
                        एप्लिकेशन को हिंदी में उपयोग करें
                      </span>
                    </div>
                  </label>
                </div>

                <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <p className="text-sm text-blue-800">
                    <span className="font-semibold">
                      {language === "en" ? "Note:" : "नोट:"}
                    </span>{" "}
                    {language === "en"
                      ? "Language changes will be applied after refreshing the page."
                      : "भाषा परिवर्तन पृष्ठ को ताज़ा करने के बाद लागू होंगे।"}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
