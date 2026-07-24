const { withDangerousMod } = require("expo/config-plugins");
const fs = require("fs");
const path = require("path");

// GoogleSignIn SDK'sının bazı Swift bağımlılıkları (AppCheckCore) modül
// tanımlamayan GoogleUtilities/RecaptchaInterop'a ihtiyaç duyuyor. Statik
// kütüphane olarak derlenirken bu iki pod için modular header üretilmesi
// gerekiyor, yoksa `pod install` "cannot yet be integrated as static
// libraries" hatasıyla düşüyor.
const PODS_NEEDING_MODULAR_HEADERS = ["GoogleUtilities", "RecaptchaInterop"];

function withGoogleSignInModularHeaders(config) {
  return withDangerousMod(config, [
    "ios",
    async (config) => {
      const podfilePath = path.join(config.modRequest.platformProjectRoot, "Podfile");
      let contents = fs.readFileSync(podfilePath, "utf-8");

      const injection = PODS_NEEDING_MODULAR_HEADERS.map(
        (name) => `  pod '${name}', :modular_headers => true`
      ).join("\n");

      if (!contents.includes(injection)) {
        contents = contents.replace(
          "use_expo_modules!",
          `use_expo_modules!\n${injection}`
        );
        fs.writeFileSync(podfilePath, contents);
      }

      return config;
    },
  ]);
}

module.exports = withGoogleSignInModularHeaders;
