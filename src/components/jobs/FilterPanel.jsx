import { JOB_TYPES, EXPERIENCE_LEVELS } from '../../utils/constants';
import Input from '../common/Input';

export default function FilterPanel({ filters, onFilterChange }) {
  const { location, type, experience, category } = filters;

  return (
    <aside className="rounded-lg border border-[#e5e7eb] dark:border-gray-700 bg-white dark:bg-gray-800 p-4 space-y-3 shadow-sm">
      <h3 className="text-xs font-semibold text-[#6b7280] dark:text-gray-400 uppercase tracking-wide">
        Filters
      </h3>
      <Input
        label="Location"
        placeholder="Search by location (Remote, Chennai, Bangalore)"
        value={location}
        onChange={(e) => onFilterChange({ location: e.target.value })}
      />
      <Input
        label="Category"
        placeholder="Role or category"
        value={category}
        onChange={(e) => onFilterChange({ category: e.target.value })}
      />
      <div>
        <label className="block text-sm font-medium text-[#6b7280] dark:text-gray-300 mb-1">
          Job type
        </label>
        <select
          value={type}
          onChange={(e) => onFilterChange({ type: e.target.value })}
          className="w-full rounded-lg border border-[#e5e7eb] dark:border-gray-600 bg-white dark:bg-gray-800 text-[#111827] dark:text-gray-100 text-sm px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#2563eb]/30 focus:border-[#2563eb] transition-shadow duration-200"
        >
          <option value="">All types</option>
          {JOB_TYPES.map((t) => (
            <option key={t} value={t}>{t}</option>
          ))}
        </select>
      </div>
      <div>
        <label className="block text-sm font-medium text-[#6b7280] dark:text-gray-300 mb-1">
          Experience
        </label>
        <select
          value={experience}
          onChange={(e) => onFilterChange({ experience: e.target.value })}
          className="w-full rounded-lg border border-[#e5e7eb] dark:border-gray-600 bg-white dark:bg-gray-800 text-[#111827] dark:text-gray-100 text-sm px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#2563eb]/30 focus:border-[#2563eb] transition-shadow duration-200"
        >
          <option value="">All levels</option>
          {EXPERIENCE_LEVELS.map((e) => (
            <option key={e} value={e}>{e}</option>
          ))}
        </select>
      </div>
    </aside>
  );
}
