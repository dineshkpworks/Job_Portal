export default function Input({
  label,
  error,
  type = 'text',
  className = '',
  ...props
}) {
  const id = props.id || props.name;
  return (
    <div className="w-full">
      {label && (
        <label htmlFor={id} className="block text-sm font-medium text-[#6b7280] dark:text-gray-300 mb-1">
          {label}
        </label>
      )}
      <input
        id={id}
        type={type}
        className={`w-full rounded-lg border border-[#e5e7eb] dark:border-gray-600 bg-white dark:bg-gray-800 text-[#111827] dark:text-gray-100 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#2563eb]/30 focus:border-[#2563eb] transition-shadow duration-200 ${error ? 'border-red-500' : ''} ${className}`}
        {...props}
      />
      {error && (
        <p className="mt-1 text-sm text-red-600 dark:text-red-400">{error}</p>
      )}
    </div>
  );
}
