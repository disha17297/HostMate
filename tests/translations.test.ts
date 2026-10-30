import { describe, it, expect } from 'vitest';
import { TRANSLATIONS } from '../src/data/translations';

describe('Bilingual Localization (English & Hindi)', () => {
  it('enforces exact brand name and taglines in both languages', () => {
    expect(TRANSLATIONS.en.brand).toBe('HostMate');
    expect(TRANSLATIONS.hi.brand).toBe('HostMate');

    expect(TRANSLATIONS.en.tagline).toBe('Budget fit, event hit!');
    expect(TRANSLATIONS.hi.tagline).toBe('बजट सही, इवेंट हिट!');
  });

  it('provides matching navigation keys across English and Hindi', () => {
    const enNavKeys = Object.keys(TRANSLATIONS.en.nav);
    const hiNavKeys = Object.keys(TRANSLATIONS.hi.nav);

    expect(enNavKeys.sort()).toEqual(hiNavKeys.sort());

    expect(TRANSLATIONS.en.nav.budget).toBe('Budget Tracker');
    expect(TRANSLATIONS.hi.nav.budget).toBe('बजट ट्रैकर');

    expect(TRANSLATIONS.en.nav.rsvp).toBe('WhatsApp RSVP');
    expect(TRANSLATIONS.hi.nav.rsvp).toBe('व्हाट्सएप RSVP');
  });

  it('contains all required landing page keys in both languages', () => {
    const enLanding = Object.keys(TRANSLATIONS.en.landing);
    const hiLanding = Object.keys(TRANSLATIONS.hi.landing);

    expect(enLanding.sort()).toEqual(hiLanding.sort());

    expect(TRANSLATIONS.en.landing.planMyEvent).toBe('PLAN MY EVENT');
    expect(TRANSLATIONS.hi.landing.planMyEvent).toBe('मेरा इवेंट प्लान करें');

    expect(TRANSLATIONS.en.landing.heroHeadline).toBe('Creating unforgettable memories');
    expect(TRANSLATIONS.hi.landing.heroHeadline).toBe('अविस्मरणीय यादों का निर्माण');
  });

  it('has consistent budget and common strings in both languages', () => {
    expect(TRANSLATIONS.en.budget.totalBudget).toBeDefined();
    expect(TRANSLATIONS.hi.budget.totalBudget).toBeDefined();

    expect(TRANSLATIONS.en.common.save).toBe('Save Changes');
    expect(TRANSLATIONS.hi.common.save).toBe('बदलाव सहेजें');
  });
});
