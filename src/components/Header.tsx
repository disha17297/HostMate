import React, { useState } from 'react';
import { Calendar, Sparkles, Plus, Globe, ChevronDown, Sun, Moon, ArrowLeft, FileCheck } from 'lucide-react';
import { Language, EventData } from '../types';
import { TRANSLATIONS } from '../data/translations';

interface HeaderProps {
  currentTab: string;
  onSelectTab: (tab: string) => void;
  lang: Language;
  onToggleLang: () => void;
  theme: 'light' | 'dark';
  onToggleTheme: () => void;
  activeEvent: EventData | null;
  allEvents: EventData[];
  onSelectEvent: (eventId: string) => void;
  onOpenWizard: () => void;
  onGoToLanding: () => void;
  onOpenTests: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentTab,
  onSelectTab,
  lang,
  onToggleLang,
  theme,
  onToggleTheme,
  activeEvent,
  allEvents,
  onSelectEvent,
  onOpenWizard,
  onGoToLanding,
  onOpenTests,
}) => {
  const t = TRANSLATIONS[lang];
  const [showEventDropdown, setShowEventDropdown] = useState(false);

  const navItems = [
    { id: 'budget', label: t.nav.budget },
    { id: 'subEvents', label: t.nav.subEvents },
    { id: 'seating', label: t.nav.seating },
    { id: 'tasks', label: t.nav.tasks },
    { id: 'rsvp', label: t.nav.rsvp },
    { id: 'microsite', label: t.nav.microsite },
    { id: 'liveWall', label: t.nav.liveWall },
    { id: 'vendors', label: t.nav.vendors },
    { id: 'aiAdvisor', label: t.nav.aiAdvisor },
    { id: 'vault', label: t.nav.vault },
    { id: 'ecoHost', label: t.nav.ecoHost },
    { id: 'pro', label: t.nav.pro },
  ];

  return (
    <header className="sticky top-0 z-30 bg-[var(--surface)]/95 backdrop-blur-md border-b border-[var(--line)] shadow-xs transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* ROW 1: Name of website, tagline, language option, theme toggle, and Landing link in ONE line */}
        <div className="flex items-center justify-between py-3 border-b border-[var(--line)]/70 gap-4">
          {/* Logo & Tagline */}
          <div 
            className="flex items-center gap-3 cursor-pointer group min-w-0" 
            onClick={() => onSelectTab('budget')}
          >
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-[#12100d] text-[#b49a45] font-serif font-bold text-sm sm:text-base flex items-center justify-center shrink-0 hm-monogram transition-transform group-hover:scale-105">
              HM
            </div>

            <div className="flex items-baseline flex-wrap gap-x-2.5 gap-y-0.5 min-w-0">
              <span className="font-serif text-2xl sm:text-3xl font-bold tracking-tight text-[var(--ink)] leading-none shrink-0">
                {t.brand}
              </span>
              <span className="hidden sm:inline text-xs text-[#b49a45] font-serif shrink-0">•</span>
              <span className="text-xs sm:text-sm font-serif italic text-[var(--muted)] tracking-normal leading-none truncate">
                "{t.tagline}"
              </span>
            </div>
          </div>

          {/* Right section of Row 1: Back to Landing, Theme Toggle, and Language */}
          <div className="flex items-center gap-2 shrink-0">
            {/* Back to Home / Landing Page button */}
            <button
              onClick={onGoToLanding}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-xl border border-[var(--line)] bg-[var(--surface)] hover:bg-[var(--bg-app)] text-[var(--ink)] transition-all shadow-2xs hover:border-[#b49a45]/60 cursor-pointer"
              title="Return to Marketing Landing Page"
            >
              <ArrowLeft className="w-3.5 h-3.5 text-[#b49a45]" />
              <span className="hidden sm:inline">{t.landing.backToHome}</span>
            </button>

            {/* Test Suite Button */}
            <button
              onClick={onOpenTests}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-xl border border-[var(--line)] bg-[var(--surface)] hover:bg-[var(--bg-app)] text-[var(--ink)] transition-all shadow-2xs hover:border-[#1c5340] cursor-pointer"
              title="Run Automated Test Cases"
            >
              <FileCheck className="w-3.5 h-3.5 text-[#1c5340]" />
              <span className="hidden md:inline">Test Suite</span>
            </button>

            {/* Dark / Light Theme Toggle */}
            <button
              onClick={onToggleTheme}
              className="p-2 rounded-xl border border-[var(--line)] bg-[var(--surface)] text-[var(--muted)] hover:text-[var(--ink)] transition-colors shadow-2xs cursor-pointer"
              title={theme === 'dark' ? 'Switch to Light Theme' : 'Switch to Dark Theme'}
            >
              {theme === 'dark' ? <Sun className="w-4 h-4 text-[#b49a45]" /> : <Moon className="w-4 h-4 text-[#6f675a]" />}
            </button>

            {/* Language Switcher */}
            <button
              onClick={onToggleLang}
              className="flex items-center gap-2 px-3.5 py-1.5 sm:px-4 sm:py-2 text-xs font-bold rounded-xl border border-[var(--line)] bg-[var(--surface)] hover:bg-[var(--bg-app)] text-[var(--ink)] transition-all shadow-2xs hover:border-[#b49a45]/60 cursor-pointer"
              title="Toggle English / हिन्दी"
            >
              <Globe className="w-4 h-4 text-[#b49a45]" />
              <span className="font-medium">{lang === 'en' ? 'हिन्दी (Hindi)' : 'English'}</span>
            </button>
          </div>
        </div>

        {/* ROW 2: Green button for Plan Event + Event selector + Tabs below */}
        <div className="py-2.5 sm:py-3 flex flex-col md:flex-row md:items-center justify-between gap-3">
          {/* Left section: Green Plan Event Button + Event Dropdown */}
          <div className="flex items-center gap-2.5 flex-wrap shrink-0">
            {/* Green button for Plan Event */}
            <button
              onClick={onOpenWizard}
              className="flex items-center gap-2.5 px-5 py-2.5 sm:px-6 sm:py-3 text-sm font-bold text-white bg-[#1c5340] hover:bg-[#164233] active:scale-[0.98] rounded-xl shadow-sm border border-[#1c5340] hover:border-[#b49a45] transition-all cursor-pointer group shrink-0"
              title="Plan event details, dates, guest counts and budget caps"
            >
              <Sparkles className="w-4 h-4 text-[#ffd97d] group-hover:rotate-12 transition-transform" />
              <span className="tracking-wide text-xs sm:text-sm">{t.wizard.planEventBtn}</span>
            </button>

            {/* Event switcher dropdown pill */}
            {activeEvent && (
              <div className="relative shrink-0">
                <button
                  type="button"
                  onClick={() => setShowEventDropdown(!showEventDropdown)}
                  className="flex items-center gap-2 px-3.5 py-2 sm:py-2.5 text-xs font-semibold text-[var(--ink)] bg-[var(--surface)] hover:bg-[var(--bg-app)] rounded-xl transition-colors border border-[var(--line)] shadow-2xs max-w-[220px] cursor-pointer"
                  title={activeEvent.title}
                >
                  <Calendar className="w-3.5 h-3.5 text-[#b49a45] shrink-0" />
                  <span className="truncate font-sans">{activeEvent.title}</span>
                  <ChevronDown className="w-3 h-3 text-[var(--muted)] shrink-0" />
                </button>

                {showEventDropdown && (
                  <div className="absolute left-0 mt-2 w-72 bg-[var(--surface)] border border-[var(--line)] rounded-xl shadow-xl py-2 z-50 animate-in fade-in zoom-in-95 duration-100">
                    <div className="px-3.5 py-1 text-[10px] font-bold text-[var(--muted)] uppercase tracking-widest">
                      {t.nav.switchEvent}
                    </div>
                    {allEvents.map((ev) => (
                      <button
                        key={ev.id}
                        onClick={() => {
                          onSelectEvent(ev.id);
                          setShowEventDropdown(false);
                        }}
                        className={`w-full text-left px-3.5 py-2.5 text-xs flex items-center justify-between hover:bg-[var(--bg-app)] transition-colors cursor-pointer ${
                          ev.id === activeEvent.id ? 'font-semibold text-[var(--ink)] bg-[var(--gold-light)] border-l-2 border-[#b49a45]' : 'text-[var(--ink)]/80'
                        }`}
                      >
                        <span className="truncate">{ev.title}</span>
                        <span className="text-[10px] text-[var(--muted)] shrink-0 ml-2 font-mono">{ev.date}</span>
                      </button>
                    ))}
                    <div className="border-t border-[var(--line)] mt-1.5 pt-1.5 px-1.5">
                      <button
                        onClick={() => {
                          setShowEventDropdown(false);
                          onOpenWizard();
                        }}
                        className="w-full text-left px-3 py-1.5 text-xs font-semibold text-[var(--ink)] hover:bg-[var(--gold-light)] rounded-lg flex items-center gap-2 transition-colors cursor-pointer"
                      >
                        <Plus className="w-3.5 h-3.5 text-[#b49a45]" />
                        <span>{t.nav.newPlan}</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Right section: Module Navigation Tabs with 2px gold underline on active */}
          <nav className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
            {navItems.map((item) => {
              const isActive = currentTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => onSelectTab(item.id)}
                  className={`px-3.5 py-2 text-xs font-semibold rounded-xl transition-all whitespace-nowrap shrink-0 relative cursor-pointer ${
                    isActive
                      ? 'text-[var(--ink)] bg-[var(--surface)] shadow-2xs border border-[var(--line)] font-bold'
                      : 'text-[var(--muted)] hover:text-[var(--ink)] hover:bg-[var(--surface)]/70'
                  }`}
                >
                  {item.label}
                  {isActive && (
                    <span className="absolute bottom-0 left-3 right-3 h-[2px] bg-[#b49a45] rounded-full" />
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
