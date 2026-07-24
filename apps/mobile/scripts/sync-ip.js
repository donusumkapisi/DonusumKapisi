#!/usr/bin/env node
// Wi-Fi ağı değiştiğinde (sabah/akşam farklı ağlar vb.) EXPO_PUBLIC_API_URL'i
// .env.local ve eas.json'daki preview build profiline otomatik yazar, sonra
// Metro'yu (varsa) öldürüp güncel IP ile yeniden başlatır.
const fs = require("fs");
const os = require("os");
const path = require("path");
const { execSync, spawn } = require("child_process");

const PORT = 3000;
const METRO_PORT = 8081;
const ROOT = path.resolve(__dirname, "..");
const ENV_LOCAL_PATH = path.join(ROOT, ".env.local");
const EAS_JSON_PATH = path.join(ROOT, "eas.json");

function detectLanIp() {
  const override = process.argv[2];
  if (override) return override;

  const interfaces = os.networkInterfaces();
  const candidates = [];
  for (const [name, addrs] of Object.entries(interfaces)) {
    for (const addr of addrs ?? []) {
      if (addr.family === "IPv4" && !addr.internal) {
        candidates.push({ name, address: addr.address });
      }
    }
  }

  const wifi = candidates.find((c) => /wi-?fi/i.test(c.name));
  if (wifi) return wifi.address;

  const ethernet = candidates.find((c) => /ethernet/i.test(c.name));
  if (ethernet) return ethernet.address;

  if (candidates.length > 0) return candidates[0].address;

  throw new Error("Aktif bir IPv4 ağ arayüzü bulunamadı.");
}

function updateEnvLocal(ip) {
  let content = fs.readFileSync(ENV_LOCAL_PATH, "utf8");
  const newLine = `EXPO_PUBLIC_API_URL=http://${ip}:${PORT}`;
  if (/^EXPO_PUBLIC_API_URL=.*$/m.test(content)) {
    content = content.replace(/^EXPO_PUBLIC_API_URL=.*$/m, newLine);
  } else {
    content = `${newLine}\n${content}`;
  }
  fs.writeFileSync(ENV_LOCAL_PATH, content);
}

function updateEasJson(ip) {
  const json = JSON.parse(fs.readFileSync(EAS_JSON_PATH, "utf8"));
  if (json.build?.preview?.env?.EXPO_PUBLIC_API_URL) {
    json.build.preview.env.EXPO_PUBLIC_API_URL = `http://${ip}:${PORT}`;
  }
  fs.writeFileSync(EAS_JSON_PATH, `${JSON.stringify(json, null, 2)}\n`);
}

function killMetro() {
  try {
    const output = execSync(`netstat -ano | findstr :${METRO_PORT}`, {
      encoding: "utf8",
    });
    const pids = new Set(
      output
        .split("\n")
        .map((line) => line.trim().split(/\s+/).pop())
        .filter((pid) => pid && /^\d+$/.test(pid))
    );
    for (const pid of pids) {
      try {
        execSync(`taskkill /PID ${pid} /F`, { stdio: "ignore" });
        console.log(`  Metro süreci durduruldu (PID ${pid}).`);
      } catch {
        // zaten kapanmış olabilir
      }
    }
  } catch {
    // portta çalışan bir şey yok, sorun değil
  }
}

const ip = detectLanIp();
console.log(`Algılanan IP: ${ip}`);

updateEnvLocal(ip);
console.log(`.env.local güncellendi -> EXPO_PUBLIC_API_URL=http://${ip}:${PORT}`);

updateEasJson(ip);
console.log(`eas.json (preview) güncellendi -> http://${ip}:${PORT}`);

console.log("Metro yeniden başlatılıyor...");
killMetro();

const child = spawn("npx", ["expo", "start", "--dev-client", "-c"], {
  cwd: ROOT,
  stdio: "inherit",
  shell: true,
});

child.on("exit", (code) => process.exit(code ?? 0));
