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
    <header className="sticky top-0 z-30 bg-[#FAFAFD]/90 backdrop-blur-md border-b border-[#E2E8F0]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-18 gap-6">
          {/* Zone 1: Brand Wordmark (Editorial Serif + Gold Accent) */}
          <div className="flex items-center gap-3 shrink-0">
            <div 
              className="flex items-center gap-3 cursor-pointer group" 
              onClick={() => onSelectTab('budget')}
            >
              <div className="w-10 h-10 rounded-xl bg-[#1A1D20] border border-[#D4AF37]/50 flex items-center justify-center text-[#D4AF37] shadow-sm font-serif font-bold text-base tracking-widest group-hover:border-[#D4AF37] transition-colors">
                HM
              </div>
              <div>
                <span className="font-serif text-2xl font-bold tracking-tight text-[#1A1D20] block leading-none">
                  {t.brand}
                </span>
                <span className="text-[11px] font-medium text-[#7A6B43] tracking-normal block mt-1 leading-none">
                  {t.tagline}
                </span>
              </div>
            </div>

            {/* Event switcher pill */}
            {activeEvent && (
              <div className="relative ml-3 hidden sm:block">
                <button
                  type="button"
                  onClick={() => setShowEventDropdown(!showEventDropdown)}
                  className="flex items-center gap-2 px-3 py-1.5 text-xs font-semibold text-[#1A1D20] bg-white hover:bg-[#F8F6F1] rounded-lg transition-colors border border-[#E2E8F0] shadow-2xs max-w-[220px]"
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
                        className={`w-full text-left px-3.5 py-2.5 text-xs flex items-center justify-between hover:bg-[#FBF9F5] transition-colors ${
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
                        className="w-full text-left px-3 py-1.5 text-xs font-semibold text-[#1A1D20] hover:bg-[#FBF8EE] rounded-lg flex items-center gap-2 transition-colors"
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

          {/* Zone 2: Navigation Links */}
          <nav className="hidden md:flex items-center gap-1">
            {navItems.map((item) => {
              const isActive = currentTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => onSelectTab(item.id)}
                  className={`px-3.5 py-2 text-xs font-semibold rounded-lg transition-all whitespace-nowrap shrink-0 relative ${
                    isActive
                      ? 'text-[#1A1D20] bg-white shadow-2xs border border-[#E2E8F0]'
                      : 'text-slate-600 hover:text-[#1A1D20] hover:bg-white/60'
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

          {/* Zone 3: Actions & Language Toggle */}
          <div className="flex items-center gap-2.5 shrink-0">
            {/* Language Switcher */}
            <button
              onClick={onToggleLang}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-lg border border-[#E2E8F0] bg-white hover:bg-[#F8F6F1] text-[#1A1D20] transition-colors shadow-2xs"
              title="Toggle English / हिन्दी"
            >
              <Globe className="w-3.5 h-3.5 text-[#D4AF37]" />
              <span>{lang === 'en' ? 'हिन्दी' : 'English'}</span>
            </button>

            {/* Smart Wizard Launch Button */}
            <button
              onClick={onOpenWizard}
              className="flex items-center gap-2 px-4 py-2 text-xs font-bold text-white bg-[#1A1D20] hover:bg-[#2A2F35] active:bg-black rounded-lg shadow-sm border border-[#1A1D20] transition-all whitespace-nowrap shrink-0"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
              <span>{t.wizard.reconfigureBtn}</span>
            </button>
          </div>
        </div>

        {/* Mobile Navigation Row */}
        <div className="md:hidden flex items-center justify-between overflow-x-auto py-2.5 gap-1.5 border-t border-[#E2E8F0] no-scrollbar">
          {navItems.map((item) => {
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onSelectTab(item.id)}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg whitespace-nowrap shrink-0 ${
                  isActive ? 'text-[#1A1D20] bg-white border border-[#E2E8F0] font-bold' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
};
