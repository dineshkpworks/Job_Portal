export default function Badge({ children, variant = 'default', className = '' }) {
  const variants = {
    default: 'bg-gray-100 text-[#6b7280] dark:bg-gray-700 dark:text-gray-300 border border-transparent',
    tag: 'bg-white dark:bg-transparent border border-blue-200 dark:border-blue-800 text-[#2563eb] dark:text-blue-400',
    success: 'bg-green-50 text-green-800 dark:bg-green-900/30 dark:text-green-300 border border-transparent',
    warning: 'bg-amber-50 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300 border border-transparent',
    applied: 'bg-blue-50 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300 border border-transparent',
  };
  return (
    <span
      className={`inline-flex items-center rounded px-2 py-0.5 text-xs font-medium ${variants[variant] || variants.default} ${className}`}
    >
      {children}
    </span>
  );
}
