export default function Loader({ size = 'md' }) {
  const sizes = {
    sm: 'w-5 h-5 border-2',
    md: 'w-8 h-8 border-2',
    lg: 'w-12 h-12 border-2',
  };
  return (
    <div
      className={`${sizes[size]} border-[#2563eb] border-t-transparent rounded-full animate-spin`}
      role="status"
      aria-label="Loading"
    />
  );
}
