import React from 'react';
import { Calendar, Sparkles, Plus, Globe, ChevronDown } from 'lucide-react';
import { Language, EventData } from '../types';
import { TRANSLATIONS } from '../data/translations';

interface HeaderProps {
  currentTab: string;
  onSelectTab: (tab: string) => void;
  lang: Language;
  onToggleLang: () => void;
  activeEvent: EventData | null;
  allEvents: EventData[];
  onSelectEvent: (eventId: string) => void;
  onOpenWizard: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentTab,
  onSelectTab,
  lang,
  onToggleLang,
  activeEvent,
  allEvents,
  onSelectEvent,
  onOpenWizard,
}) => {
  const t = TRANSLATIONS[lang];
  const [showEventDropdown, setShowEventDropdown] = React.useState(false);

  const navItems = [
    { id: 'budget', label: t.nav.budget },
    { id: 'tasks', label: t.nav.tasks },
    { id: 'rsvp', label: t.nav.rsvp },
    { id: 'vendors', label: t.nav.vendors },
    { id: 'aiAdvisor', label: t.nav.aiAdvisor },
  ];

  return (
    <header className="sticky top-0 z-30 bg-[#FAFAFD]/95 backdrop-blur-md border-b border-[#E2E8F0] shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* LINE 1: Name of website, tagline, language option in ONE line */}
        <div className="flex items-center justify-between py-3 border-b border-[#E2E8F0]/80 gap-4">
          {/* Name of website and tagline */}
          <div 
            className="flex items-center gap-3 cursor-pointer group min-w-0" 
            onClick={() => onSelectTab('budget')}
          >
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-[#1A1D20] border border-[#D4AF37]/50 flex items-center justify-center text-[#D4AF37] shadow-sm font-serif font-bold text-sm sm:text-base tracking-widest group-hover:border-[#D4AF37] transition-colors shrink-0">
              HM
            </div>

            <div className="flex items-baseline flex-wrap gap-x-2.5 gap-y-0.5 min-w-0">
              <span className="font-serif text-2xl sm:text-3xl font-bold tracking-tight text-[#1A1D20] leading-none shrink-0">
                {t.brand}
              </span>
              <span className="hidden sm:inline text-xs text-[#D4AF37] font-serif shrink-0">•</span>
              <span className="text-xs sm:text-sm font-medium text-[#7A6B43] tracking-normal leading-none italic truncate">
                "{t.tagline}"
              </span>
            </div>
          </div>

          {/* Language Option in the same top line */}
          <div className="shrink-0">
            <button
              onClick={onToggleLang}
              className="flex items-center gap-2 px-3.5 py-1.5 sm:px-4 sm:py-2 text-xs font-bold rounded-xl border border-[#E2E8F0] bg-white hover:bg-[#FAF8F5] text-[#1A1D20] transition-all shadow-2xs hover:border-[#D4AF37]/60 cursor-pointer"
              title="Toggle English / हिन्दी"
            >
              <Globe className="w-4 h-4 text-[#D4AF37]" />
              <span className="font-medium">{lang === 'en' ? 'हिन्दी (Hindi)' : 'English'}</span>
            </button>
          </div>
        </div>

        {/* LINE 2: Bigger button for plan event below name & tagline + rest of all options below */}
        <div className="py-2.5 sm:py-3 flex flex-col md:flex-row md:items-center justify-between gap-3">
          {/* Left section: Bigger Plan Event Button placed directly below name & tagline */}
          <div className="flex items-center gap-2.5 flex-wrap shrink-0">
            <button
              onClick={onOpenWizard}
              className="flex items-center gap-2.5 px-5 py-2.5 sm:px-6 sm:py-3 text-sm font-bold text-white bg-[#1A1D20] hover:bg-[#2A2F35] active:scale-[0.98] rounded-xl shadow-sm border border-[#D4AF37]/60 hover:border-[#D4AF37] transition-all cursor-pointer group shrink-0"
              title="Plan event details, dates, guest counts and budget caps"
            >
              <Sparkles className="w-4 h-4 text-[#D4AF37] group-hover:rotate-12 transition-transform" />
              <span className="tracking-wide text-xs sm:text-sm">{t.wizard.reconfigureBtn}</span>
            </button>

            {/* Event switcher dropdown pill */}
            {activeEvent && (
              <div className="relative shrink-0">
                <button
                  type="button"
                  onClick={() => setShowEventDropdown(!showEventDropdown)}
                  className="flex items-center gap-2 px-3.5 py-2 sm:py-2.5 text-xs font-semibold text-[#1A1D20] bg-white hover:bg-[#FAF8F5] rounded-xl transition-colors border border-[#E2E8F0] shadow-2xs max-w-[220px] cursor-pointer"
                  title={activeEvent.title}
                >
                  <Calendar className="w-3.5 h-3.5 text-[#D4AF37] shrink-0" />
                  <span className="truncate font-sans">{activeEvent.title}</span>
                  <ChevronDown className="w-3 h-3 text-slate-400 shrink-0" />
                </button>

                {showEventDropdown && (
                  <div className="absolute left-0 mt-2 w-72 bg-white border border-[#E2E8F0] rounded-xl shadow-xl py-2 z-50 animate-in fade-in zoom-in-95 duration-100">
                    <div className="px-3.5 py-1 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                      {t.nav.switchEvent}
                    </div>
                    {allEvents.map((ev) => (
                      <button
                        key={ev.id}
                        onClick={() => {
                          onSelectEvent(ev.id);
                          setShowEventDropdown(false);
                        }}
                        className={`w-full text-left px-3.5 py-2.5 text-xs flex items-center justify-between hover:bg-[#FBF9F5] transition-colors cursor-pointer ${
                          ev.id === activeEvent.id ? 'font-semibold text-[#1A1D20] bg-[#FAF8F3] border-l-2 border-[#D4AF37]' : 'text-slate-700'
                        }`}
                      >
                        <span className="truncate">{ev.title}</span>
                        <span className="text-[10px] text-slate-400 shrink-0 ml-2 font-mono">{ev.date}</span>
                      </button>
                    ))}
                    <div className="border-t border-slate-100 mt-1.5 pt-1.5 px-1.5">
                      <button
                        onClick={() => {
                          setShowEventDropdown(false);
                          onOpenWizard();
                        }}
                        className="w-full text-left px-3 py-1.5 text-xs font-semibold text-[#1A1D20] hover:bg-[#FBF8EE] rounded-lg flex items-center gap-2 transition-colors cursor-pointer"
                      >
                        <Plus className="w-3.5 h-3.5 text-[#D4AF37]" />
                        <span>{t.nav.newPlan}</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Right section of Line 2: All module options / navigation tabs */}
          <nav className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
            {navItems.map((item) => {
              const isActive = currentTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => onSelectTab(item.id)}
                  className={`px-3.5 py-2 text-xs font-semibold rounded-xl transition-all whitespace-nowrap shrink-0 relative cursor-pointer ${
                    isActive
                      ? 'text-[#1A1D20] bg-white shadow-2xs border border-[#E2E8F0] font-bold'
                      : 'text-slate-600 hover:text-[#1A1D20] hover:bg-white/70'
                  }`}
                >
                  {item.label}
                  {isActive && (
                    <span className="absolute bottom-0 left-3 right-3 h-[2px] bg-[#D4AF37] rounded-full" />
                  )}
                </button>
              );
            })}
          </nav>
        </div>
      </div>
    </header>
  );
};
