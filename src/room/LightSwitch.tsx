/** A small wall light switch, drawn in the room's thick-outline style. */
function LightSwitch() {
  return (
    <svg viewBox="0 0 26 40" width="100%" height="100%" aria-hidden="true">
      <rect
        x="2"
        y="2"
        width="22"
        height="36"
        rx="4"
        fill="#ffffff"
        stroke="#141416"
        strokeWidth="2.5"
      />
      <rect
        x="9"
        y="9"
        width="8"
        height="22"
        rx="2.5"
        fill="#ffffff"
        stroke="#141416"
        strokeWidth="2"
      />
      <rect x="10.5" y="10.5" width="5" height="9" rx="1.5" fill="#141416" />
    </svg>
  );
}

export default LightSwitch;
