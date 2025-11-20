interface TabNavigationProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const tabs = [
  { id: 'bot', label: 'BOT', color: 'from-blue-600 to-cyan-600' },
  { id: 'executor', label: 'EXECUTOR ROBLOX', color: 'from-orange-600 to-red-600' },
  { id: 'script', label: 'SCRIPT', color: 'from-green-600 to-emerald-600' },
];

export default function TabNavigation({ activeTab, onTabChange }: TabNavigationProps) {
  return (
    <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onTabChange(tab.id)}
          className={`px-8 py-3 rounded-lg font-bold text-lg whitespace-nowrap transition-all duration-300 ${
            activeTab === tab.id
              ? `bg-gradient-to-r ${tab.color} text-white shadow-lg shadow-${tab.color.split(' ')[1]}/50`
              : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
          }`}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}
