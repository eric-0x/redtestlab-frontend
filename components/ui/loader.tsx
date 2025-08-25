import React from "react"

const Loader: React.FC<{ size?: number }> = ({ size = 48 }) => (
  <span
    className="loader"
    style={{ width: size, height: size, display: "inline-block" }}
  >
    <style>{`
      .loader {
        border: 5px solid #000000;
        border-bottom-color: transparent;
        border-radius: 50%;
        box-sizing: border-box;
        animation: rotation 1s linear infinite;
      }
      @keyframes rotation {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
      }
    `}</style>
  </span>
)

export default Loader 