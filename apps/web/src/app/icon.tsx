import { ImageResponse } from "next/og";

export const size = { width: 32, height: 32 };
export const contentType = "image/png";

/** DönüşümKapısı — ThresholdMark tab ikonu (koyu zemin + turkuaz eşik). */
export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#0e3446",
          borderRadius: 8,
        }}
      >
        <svg width="22" height="22" viewBox="0 0 32 32" fill="none">
          <path
            d="M7 28V6.5C7 5.67157 7.67157 5 8.5 5H23.5C24.3284 5 25 5.67157 25 6.5V28"
            stroke="#eef6f8"
            strokeOpacity="0.9"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <line
            x1="4"
            y1="28"
            x2="28"
            y2="28"
            stroke="#eef6f8"
            strokeOpacity="0.9"
            strokeWidth="2"
            strokeLinecap="round"
          />
          <line
            x1="16"
            y1="28"
            x2="16"
            y2="10"
            stroke="#0fb4a5"
            strokeWidth="2.2"
            strokeLinecap="round"
          />
        </svg>
      </div>
    ),
    { ...size }
  );
}
