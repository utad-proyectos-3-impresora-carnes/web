export default function ClockIcon({ width = 25, height = 24 }) {
  return (
    <svg width={width} height={height} viewBox="0 0 25 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="12.5" cy="12" r="10" stroke="#EAB308" strokeWidth="2" />
      <path d="M12.5 7V12L15.5 14" stroke="#EAB308" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
