import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { SetupWizardModal } from './components/SetupWizardModal';
import { BudgetTracker } from './components/BudgetTracker';
import { MilestoneTimeline } from './components/MilestoneTimeline';
import { RsvpDashboard } from './components/RsvpDashboard';
import { RsvpPublicView } from './components/RsvpPublicView';
import { VendorHub } from './components/VendorHub';
import { AiAdviceModal } from './components/AiAdviceModal';
import { EventData, Language, Vendor, GuestRsvp } from './types';
import { TRANSLATIONS } from './data/translations';
import { 
  getStoredEvents, 
  saveActiveEvent, 
  getActiveEventId, 
  setActiveEventId 
} from './utils/storage';
import { 
  Sparkles, 
  Calendar, 
  Users, 
  Wallet, 
  Clock, 
  CheckCircle2, 
  MessageCircle, 
  ChevronRight,
  TrendingUp,
  ShieldCheck,
  Compass
} from 'lucide-react';

export default function App() {
  const [lang, setLang] = useState<Language>(() => {
    const saved = localStorage.getItem('hostmate_lang');
    return saved === 'hi' ? 'hi' : 'en';
  });

  const [allEvents, setAllEvents] = useState<EventData[]>([]);
  const [activeEventId, setActiveEventIdState] = useState<string>('');
  const [currentTab, setCurrentTab] = useState<string>('budget');

  // Modals state
  const [showWizard, setShowWizard] = useState(false);
  const [showAiModal, setShowAiModal] = useState(false);
  const [aiModalTab, setAiModalTab] = useState<'budget' | 'ideas' | 'vendor'>('budget');
  const [selectedVendorForAi, setSelectedVendorForAi] = useState<Vendor | null>(null);

  // Standalone RSVP view mode (when query param ?rsvp=... is present or user clicked preview)
  const [publicRsvpMode, setPublicRsvpMode] = useState(false);

  // Load events on mount
  useEffect(() => {
    const events = getStoredEvents();
    setAllEvents(events);
    const activeId = getActiveEventId();
    const found = events.find((e) => e.id === activeId) || events[0];
    if (found) {
      setActiveEventIdState(found.id);
    }

    // Check query params for RSVP link
    const params = new URLSearchParams(window.location.search);
    if (params.get('rsvp')) {
      const rsvpEventId = params.get('rsvp');
      const targetEvent = events.find((e) => e.id === rsvpEventId);
      if (targetEvent) {
        setActiveEventIdState(targetEvent.id);
      }
      setPublicRsvpMode(true);
    }
  }, []);

  const handleToggleLang = () => {
    const nextLang = lang === 'en' ? 'hi' : 'en';
    setLang(nextLang);
    localStorage.setItem('hostmate_lang', nextLang);
  };

  const activeEvent = allEvents.find((e) => e.id === activeEventId) || allEvents[0] || null;

  const handleSelectEvent = (id: string) => {
    setActiveEventIdState(id);
    setActiveEventId(id);
  };

  const handleUpdateActiveEvent = (updated: EventData) => {
    const newEvents = saveActiveEvent(updated);
    setAllEvents(newEvents);
  };

  const handleWizardComplete = (newEvent: EventData) => {
    const newEvents = saveActiveEvent(newEvent);
    setAllEvents(newEvents);
    setActiveEventIdState(newEvent.id);
    setCurrentTab('budget');
  };

  // RSVP submission from guest public form
  const handleAddGuestRsvp = (rsvp: GuestRsvp) => {
    if (!activeEvent) return;
    const updated = {
      ...activeEvent,
      rsvps: [rsvp, ...activeEvent.rsvps],
    };
    handleUpdateActiveEvent(updated);
  };

  // Open AI modal with specific tab
  const handleOpenAiModal = (tab: 'budget' | 'ideas' | 'vendor', vendor?: Vendor) => {
    setAiModalTab(tab);
    setSelectedVendorForAi(vendor || null);
    setShowAiModal(true);
  };

  const t = TRANSLATIONS[lang];

  // If in Public Guest RSVP Form Mode:
  if (publicRsvpMode && activeEvent) {
    return (
      <RsvpPublicView
        event={activeEvent}
        lang={lang}
        onAddRsvp={handleAddGuestRsvp}
        onBackToDashboard={() => setPublicRsvpMode(false)}
        isStandalone={true}
      />
    );
  }

  // Calculate days left
  let daysLeft = 0;
  if (activeEvent?.date) {
    const today = new Date();
    const eventD = new Date(activeEvent.date);
    daysLeft = Math.ceil((eventD.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
  }

  return (
    <div className="min-h-screen bg-[#FAF8F5] text-[#1A1D20] flex flex-col antialiased">
      {/* 3-Zone Top Navigation Bar */}
      <Header
        currentTab={currentTab}
        onSelectTab={setCurrentTab}
        lang={lang}
        onToggleLang={handleToggleLang}
        activeEvent={activeEvent}
        allEvents={allEvents}
        onSelectEvent={handleSelectEvent}
        onOpenWizard={() => setShowWizard(true)}
      />

      {/* Main Workspace Body */}
      {activeEvent ? (
        <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
          {/* Executive Hero Event Strip */}
          <div className="bg-white rounded-2xl border border-[#E2E8F0] p-5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-13 h-13 rounded-2xl bg-[#1A1D20] border border-[#D4AF37]/40 text-[#D4AF37] flex items-center justify-center font-bold text-2xl shrink-0 shadow-xs">
                {activeEvent.type === 'wedding' ? '💍' : activeEvent.type === 'birthday' ? '🎂' : '🎪'}
              </div>
              <div>
                <div className="flex items-center gap-2.5">
                  <h1 className="text-xl sm:text-2xl font-serif font-bold text-[#1A1D20] tracking-tight">
                    {activeEvent.title}
                  </h1>
                  <span className="text-[10px] font-bold uppercase tracking-wider bg-[#D4AF37]/15 text-[#8F741C] border border-[#D4AF37]/30 px-2.5 py-0.5 rounded-full">
                    {activeEvent.type}
                  </span>
                </div>
                <div className="flex flex-wrap items-center gap-3 text-xs text-[#1A1D20]/65 mt-1.5">
                  <span className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-[#D4AF37]" />
                    <strong className="text-[#1A1D20]">{activeEvent.date}</strong>
                    {daysLeft > 0 ? (
                      <span className="text-[#8F741C] font-semibold font-mono tabular-nums">
                        ({daysLeft} {t.common.daysLeft})
                      </span>
                    ) : (
                      <span className="text-[#1B4332] font-semibold">({lang === 'hi' ? 'आज / संपन्न' : 'Today / Completed'})</span>
                    )}
                  </span>
                  <span className="text-[#E2E8F0]">•</span>
                  <span className="flex items-center gap-1.5">
                    <Users className="w-3.5 h-3.5 text-[#D4AF37]" />
                    <strong className="font-mono tabular-nums text-[#1A1D20]">{activeEvent.guestCount}</strong> {t.common.guests}
                  </span>
                  <span className="text-[#E2E8F0]">•</span>
                  <span className="flex items-center gap-1.5">
                    <Wallet className="w-3.5 h-3.5 text-[#D4AF37]" />
                    <span>{lang === 'hi' ? 'कुल बजट' : 'Total Budget'}:</span>
                    <strong className="font-mono tabular-nums text-[#1A1D20]">
                      {activeEvent.currency} {activeEvent.totalBudget.toLocaleString()}
                    </strong>
                  </span>
                </div>
              </div>
            </div>

            {/* Quick Action Concierge Badges */}
            <div className="flex items-center gap-2.5 self-start md:self-auto shrink-0">
              <button
                onClick={() => setPublicRsvpMode(true)}
                className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-xl bg-[#1B4332] hover:bg-[#1B4332]/90 text-white border border-[#1B4332] transition-colors shadow-xs cursor-pointer"
              >
                <MessageCircle className="w-3.5 h-3.5 text-[#D4AF37]" />
                <span>{lang === 'hi' ? 'RSVP लिंक टेस्ट करें' : 'Preview Guest RSVP'}</span>
              </button>

              <button
                onClick={() => handleOpenAiModal('ideas')}
                className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-xl bg-[#1A1D20] hover:bg-[#1A1D20]/90 text-white border border-[#D4AF37]/40 transition-colors shadow-xs cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
                <span>{lang === 'hi' ? 'एआई विचार' : 'AI Ideas'}</span>
              </button>
            </div>
          </div>

          {/* Active Tab View */}
          {currentTab === 'budget' && (
            <BudgetTracker
              event={activeEvent}
              onUpdateEvent={handleUpdateActiveEvent}
              lang={lang}
              onOpenAiBudgetModal={() => handleOpenAiModal('budget')}
            />
          )}

          {currentTab === 'tasks' && (
            <MilestoneTimeline
              event={activeEvent}
              onUpdateEvent={handleUpdateActiveEvent}
              lang={lang}
            />
          )}

          {currentTab === 'rsvp' && (
            <RsvpDashboard
              event={activeEvent}
              onUpdateEvent={handleUpdateActiveEvent}
              lang={lang}
              onPreviewPublicForm={() => setPublicRsvpMode(true)}
            />
          )}

          {currentTab === 'vendors' && (
            <VendorHub
              event={activeEvent}
              onUpdateEvent={handleUpdateActiveEvent}
              lang={lang}
              onReviewVendorAi={(v) => handleOpenAiModal('vendor', v)}
            />
          )}

          {currentTab === 'aiAdvisor' && (
            <div className="bg-white rounded-2xl border border-[#E2E8F0] p-8 text-center space-y-4 shadow-xs">
              <div className="w-14 h-14 bg-[#1A1D20] text-[#D4AF37] rounded-2xl flex items-center justify-center mx-auto shadow-xs border border-[#D4AF37]/30">
                <Sparkles className="w-7 h-7" />
              </div>
              <h2 className="text-2xl font-serif font-bold text-[#1A1D20]">{t.aiAdvisor.title}</h2>
              <p className="text-xs text-[#1A1D20]/65 max-w-md mx-auto">{t.aiAdvisor.tagline}</p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 max-w-xl mx-auto pt-3">
                <button
                  onClick={() => handleOpenAiModal('budget')}
                  className="p-4 rounded-xl border border-[#E2E8F0] hover:border-[#D4AF37] hover:bg-[#FAF8F5] text-left transition-all group cursor-pointer bg-white"
                >
                  <Wallet className="w-5 h-5 text-[#D4AF37] mb-2 group-hover:scale-110 transition-transform" />
                  <div className="font-semibold text-xs text-[#1A1D20]">{t.aiAdvisor.tabBudget}</div>
                  <div className="text-[10px] text-[#1A1D20]/60 mt-0.5">Audit caps & save costs</div>
                </button>

                <button
                  onClick={() => handleOpenAiModal('ideas')}
                  className="p-4 rounded-xl border border-[#E2E8F0] hover:border-[#D4AF37] hover:bg-[#FAF8F5] text-left transition-all group cursor-pointer bg-white"
                >
                  <Sparkles className="w-5 h-5 text-[#D4AF37] mb-2 group-hover:scale-110 transition-transform" />
                  <div className="font-semibold text-xs text-[#1A1D20]">{t.aiAdvisor.tabIdeas}</div>
                  <div className="text-[10px] text-[#1A1D20]/60 mt-0.5">Themes, decor & twists</div>
                </button>

                <button
                  onClick={() => handleOpenAiModal('vendor')}
                  className="p-4 rounded-xl border border-[#E2E8F0] hover:border-[#D4AF37] hover:bg-[#FAF8F5] text-left transition-all group cursor-pointer bg-white"
                >
                  <CheckCircle2 className="w-5 h-5 text-[#1B4332] mb-2 group-hover:scale-110 transition-transform" />
                  <div className="font-semibold text-xs text-[#1A1D20]">{t.aiAdvisor.tabVendor}</div>
                  <div className="text-[10px] text-[#1A1D20]/60 mt-0.5">Contract & clauses review</div>
                </button>
              </div>
            </div>
          )}
        </main>
      ) : (
        <div className="flex-1 flex items-center justify-center p-6">
          <div className="text-center space-y-3 bg-white p-8 rounded-2xl border border-[#E2E8F0] max-w-md shadow-xs">
            <div className="w-12 h-12 rounded-xl bg-[#1A1D20] text-[#D4AF37] flex items-center justify-center mx-auto border border-[#D4AF37]/30">
              <Compass className="w-6 h-6" />
            </div>
            <h2 className="text-xl font-serif font-bold text-[#1A1D20]">Welcome to HostMate</h2>
            <p className="text-xs text-[#1A1D20]/65 italic">
              {lang === 'hi' ? 'बजट सही, इवेंट हिट!' : 'Budget fit, event hit!'}
            </p>
            <button
              onClick={() => setShowWizard(true)}
              className="mt-2 px-5 py-2.5 text-xs font-semibold text-white bg-[#1A1D20] hover:bg-[#1A1D20]/90 rounded-xl shadow-xs border border-[#D4AF37]/40 cursor-pointer"
            >
              Start Smart Setup Wizard
            </button>
          </div>
        </div>
      )}

      {/* Smart Setup Wizard Modal */}
      <SetupWizardModal
        isOpen={showWizard}
        onClose={() => setShowWizard(false)}
        lang={lang}
        onComplete={handleWizardComplete}
        existingEvent={activeEvent}
      />

      {/* AI Advice & Review Modal */}
      {activeEvent && (
        <AiAdviceModal
          isOpen={showAiModal}
          onClose={() => setShowAiModal(false)}
          initialTab={aiModalTab}
          event={activeEvent}
          lang={lang}
          selectedVendor={selectedVendorForAi}
        />
      )}
    </div>
  );
}
