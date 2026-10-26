import React, { useState } from 'react';
import { 
  Plus, 
  Trash2, 
  Sparkles, 
  TrendingUp, 
  AlertTriangle, 
  CheckCircle2, 
  Calendar,
  Wallet,
  Clock,
  ArrowUpRight
} from 'lucide-react';
import { BudgetCategory, EventData, Language } from '../types';
import { TRANSLATIONS } from '../data/translations';
import { formatCurrency } from '../utils/storage';

interface BudgetTrackerProps {
  event: EventData;
  onUpdateEvent: (updated: EventData) => void;
  lang: Language;
  onOpenAiBudgetModal: () => void;
}

export const BudgetTracker: React.FC<BudgetTrackerProps> = ({
  event,
  onUpdateEvent,
  lang,
  onOpenAiBudgetModal,
}) => {
  const t = TRANSLATIONS[lang];
  const currency = event.currency || '₹';

  // Calculate totals
  const totalBudget = Number(event.totalBudget) || 1;
  const totalEstimated = event.budgetItems.reduce((acc, curr) => acc + (Number(curr.estimatedCost) || 0), 0);
  const totalActual = event.budgetItems.reduce((acc, curr) => acc + (Number(curr.actualCost) || 0), 0);
  const totalAdvance = event.budgetItems.reduce((acc, curr) => acc + (Number(curr.advancePaid) || 0), 0);
  const totalBalanceDue = Math.max(0, totalActual - totalAdvance);

  const spentPercentage = Math.round((totalActual / totalBudget) * 100);

  // Status helper
  let progressColor = 'bg-emerald-500';
  let statusText = t.budget.budgetStatusSafe;
  let statusBg = 'text-emerald-700 bg-emerald-50 border-emerald-200';

  if (spentPercentage > 100) {
    progressColor = 'bg-rose-500';
    statusText = `${t.budget.budgetStatusDanger} (${spentPercentage}%)`;
    statusBg = 'text-rose-700 bg-rose-50 border-rose-200';
  } else if (spentPercentage >= 85) {
    progressColor = 'bg-amber-500';
    statusText = `${t.budget.budgetStatusWarning} (${spentPercentage}%)`;
    statusBg = 'text-amber-700 bg-amber-50 border-amber-200';
  }

  // Adding new item state
  const [showAddModal, setShowAddModal] = useState(false);
  const [newItemName, setNewItemName] = useState('');
  const [newItemEst, setNewItemEst] = useState('');
  const [newItemAct, setNewItemAct] = useState('');
  const [newItemAdv, setNewItemAdv] = useState('');
  const [newItemDue, setNewItemDue] = useState(event.date || '');
  const [newItemNotes, setNewItemNotes] = useState('');

  const handleAddItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItemName.trim()) return;

    const est = Number(newItemEst) || 0;
    const act = Number(newItemAct) || est;
    const adv = Number(newItemAdv) || 0;

    const newItem: BudgetCategory = {
      id: `budget-${Date.now()}`,
      name: newItemName.trim(),
      nameHi: newItemName.trim(),
      recommendedPct: Math.round((est / totalBudget) * 100) || 5,
      estimatedCost: est,
      actualCost: act,
      advancePaid: adv,
      dueDate: newItemDue || event.date,
      notes: newItemNotes.trim(),
    };

    const updatedItems = [...event.budgetItems, newItem];
    onUpdateEvent({ ...event, budgetItems: updatedItems });

    setNewItemName('');
    setNewItemEst('');
    setNewItemAct('');
    setNewItemAdv('');
    setNewItemNotes('');
    setShowAddModal(false);
  };

  const handleUpdateItemField = (id: string, field: keyof BudgetCategory, val: any) => {
    const updated = event.budgetItems.map((item) => {
      if (item.id === id) {
        return { ...item, [field]: val };
      }
      return item;
    });
    onUpdateEvent({ ...event, budgetItems: updated });
  };

  const handleDeleteItem = (id: string) => {
    const updated = event.budgetItems.filter((i) => i.id !== id);
    onUpdateEvent({ ...event, budgetItems: updated });
  };

  return (
    <div className="space-y-6">
      {/* High-Contrast Header Banner (Royal Charcoal #1A1D20 + Champagne Gold #D4AF37 + Emerald #1B4332) */}
      <div className="bg-[#1A1D20] text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-[#D4AF37]/30 relative overflow-hidden">
        {/* Subtle decorative gold ambient glow */}
        <div className="absolute -top-24 -right-24 w-80 h-80 bg-[#D4AF37]/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div>
              <div className="flex items-center gap-2.5">
                <span className="text-[10px] font-bold uppercase tracking-widest text-[#D4AF37]">
                  {lang === 'hi' ? 'वित्तीय डैशबोर्ड' : 'HostMate Financial Vault'}
                </span>
                <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-semibold ${
                  spentPercentage > 100 
                    ? 'bg-rose-900/60 text-rose-300 border border-rose-500/40' 
                    : spentPercentage >= 85 
                    ? 'bg-amber-900/60 text-amber-300 border border-amber-500/40' 
                    : 'bg-[#1B4332] text-emerald-200 border border-emerald-500/30'
                }`}>
                  {statusText}
                </span>
              </div>
              <h2 className="font-serif text-2xl sm:text-3xl font-bold tracking-tight text-white mt-1">
                {t.budget.title}
              </h2>
              <p className="text-xs text-slate-400 mt-1">{t.budget.subtitle}</p>
            </div>

            <div className="flex items-center gap-2.5">
              <button
                onClick={onOpenAiBudgetModal}
                className="flex items-center gap-2 px-4 py-2 text-xs font-bold text-[#D4AF37] bg-white/10 hover:bg-white/15 rounded-xl transition-all border border-[#D4AF37]/40 shadow-sm"
              >
                <Sparkles className="w-4 h-4 text-[#D4AF37]" />
                <span>{t.budget.getAiAdvice}</span>
              </button>

              <button
                onClick={() => setShowAddModal(true)}
                className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-[#1A1D20] bg-[#D4AF37] hover:bg-[#E5C768] rounded-xl transition-all shadow-md active:scale-[0.99]"
              >
                <Plus className="w-4 h-4 text-[#1A1D20]" />
                <span>{t.budget.addItem}</span>
              </button>
            </div>
          </div>

          {/* Budget Consumption Bar */}
          <div className="space-y-2.5 bg-black/25 p-4 rounded-2xl border border-white/10 backdrop-blur-xs">
            <div className="flex items-center justify-between text-xs font-medium text-slate-300">
              <span className="flex items-center gap-2">
                <span>{lang === 'hi' ? 'कुल खर्च बनाम बजट सीमा' : 'Total Spent vs Budget Cap'}:</span>
                <strong className="text-white font-mono tabular-nums text-sm font-bold">
                  {formatCurrency(totalActual, currency)}
                </strong>
                <span className="text-slate-400 font-mono text-[11px]">
                  / {formatCurrency(totalBudget, currency)}
                </span>
              </span>
              <span className="font-mono tabular-nums font-bold text-[#D4AF37] text-sm">
                {spentPercentage}%
              </span>
            </div>

            <div className="w-full h-3 bg-white/10 rounded-full overflow-hidden p-0.5 border border-white/10">
              <div
                className={`h-full rounded-full transition-all duration-500 ${
                  spentPercentage > 100 
                    ? 'bg-rose-500' 
                    : spentPercentage >= 85 
                    ? 'bg-amber-400' 
                    : 'bg-gradient-to-r from-[#D4AF37] to-[#F3E5AB]'
                }`}
                style={{ width: `${Math.min(100, spentPercentage)}%` }}
              />
            </div>
          </div>

          {/* 4 Financial Ledger Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5 mt-5">
            <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
              <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center justify-between">
                <span>{t.budget.totalBudget}</span>
                <Wallet className="w-3.5 h-3.5 text-[#D4AF37]" />
              </div>
              <div className="text-xl font-bold font-mono tabular-nums text-white mt-1">
                {formatCurrency(totalBudget, currency)}
              </div>
              <div className="text-[11px] text-slate-400 mt-0.5">
                {event.guestCount} {t.common.guests} · {currency}{Math.round(totalBudget / (event.guestCount || 1))}/pax
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
              <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center justify-between">
                <span>{t.budget.totalSpent}</span>
                <TrendingUp className="w-3.5 h-3.5 text-[#D4AF37]" />
              </div>
              <div className={`text-xl font-bold font-mono tabular-nums mt-1 ${spentPercentage > 100 ? 'text-rose-400' : 'text-white'}`}>
                {formatCurrency(totalActual, currency)}
              </div>
              <div className="text-[11px] text-slate-400 mt-0.5">
                Est: {formatCurrency(totalEstimated, currency)}
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
              <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center justify-between">
                <span>{t.budget.totalAdvance}</span>
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              </div>
              <div className="text-xl font-bold font-mono tabular-nums text-emerald-300 mt-1">
                {formatCurrency(totalAdvance, currency)}
              </div>
              <div className="text-[11px] text-emerald-400/80 mt-0.5">
                {totalActual > 0 ? `${Math.round((totalAdvance / totalActual) * 100)}% settled` : 'No advance recorded'}
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
              <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center justify-between">
                <span>{t.budget.balanceDue}</span>
                <Clock className="w-3.5 h-3.5 text-amber-400" />
              </div>
              <div className="text-xl font-bold font-mono tabular-nums text-[#F3E5AB] mt-1">
                {formatCurrency(totalBalanceDue, currency)}
              </div>
              <div className="text-[11px] text-amber-300/80 mt-0.5">
                {lang === 'hi' ? 'वेंडर्स को देय शेष' : 'Due on or before event'}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Preset Split Info Tip */}
      <div className="text-xs text-[#7A6B43] bg-[#FAF8EE] border border-[#E8DEBE] rounded-2xl px-5 py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-2xs">
        <span className="flex items-center gap-2">
          <span className="text-[#D4AF37] font-bold text-base">✦</span>
          <span>{t.budget.autoPresetTip}</span>
        </span>
        <button
          onClick={() => {
            const updated = event.budgetItems.map((item) => {
              if (item.recommendedPct) {
                const rec = Math.round((totalBudget * item.recommendedPct) / 100);
                return { ...item, estimatedCost: rec };
              }
              return item;
            });
            onUpdateEvent({ ...event, budgetItems: updated });
          }}
          className="text-[#1A1D20] hover:text-[#9A813A] font-bold underline shrink-0 cursor-pointer"
        >
          {lang === 'hi' ? 'बजट कैप्स पुनः लागू करें' : 'Re-apply Cap Splits'}
        </button>
      </div>

      {/* Interactive Budget Items Table */}
      <div className="bg-white rounded-3xl border border-[#E2E8F0] shadow-sm overflow-hidden">
        <div className="p-5 border-b border-[#E2E8F0] flex items-center justify-between bg-[#FAFAFD]/60">
          <div>
            <h3 className="font-serif text-base font-bold text-[#1A1D20]">
              {lang === 'hi' ? 'श्रेणीवार बजट विभाजन व ट्रैकिंग' : 'Itemized Category Breakdown & Payments'}
            </h3>
            <p className="text-[11px] text-slate-500 mt-0.5">
              {lang === 'hi' ? 'प्रत्येक श्रेणी का अनुमानित, वास्तविक और दिया गया एडवांस' : 'Manage line-item caps, actual commitments, and balance settlement dates'}
            </p>
          </div>
          <span className="text-xs font-mono font-bold text-slate-600 bg-[#F4F1EA] px-2.5 py-1 rounded-lg">
            {event.budgetItems.length} {lang === 'hi' ? 'मदें' : 'categories'}
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#FAF8F5] border-b border-[#E2E8F0] text-slate-700 uppercase font-bold text-[10px] tracking-wider">
              <tr>
                <th className="py-3.5 px-5">{t.budget.category}</th>
                <th className="py-3.5 px-3 text-center">{t.budget.recommendedSplit}</th>
                <th className="py-3.5 px-3">{t.budget.estimatedCost}</th>
                <th className="py-3.5 px-3">{t.budget.actualCost}</th>
                <th className="py-3.5 px-3">{t.budget.advancePaid}</th>
                <th className="py-3.5 px-3">{t.budget.balanceRemaining}</th>
                <th className="py-3.5 px-3">{t.budget.balanceDueDate}</th>
                <th className="py-3.5 px-5 text-right">{t.common.actions}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#EFEAE1]/70">
              {event.budgetItems.map((item) => {
                const remaining = Math.max(0, (Number(item.actualCost) || 0) - (Number(item.advancePaid) || 0));
                const itemPctOfBudget = Math.round(((Number(item.actualCost) || 0) / totalBudget) * 100);

                return (
                  <tr key={item.id} className="hover:bg-[#FAF8F5]/80 transition-colors">
                    {/* Category Name */}
                    <td className="py-3.5 px-5 font-bold text-[#1A1D20] min-w-[170px]">
                      <div>{lang === 'hi' && item.nameHi ? item.nameHi : item.name}</div>
                      {item.notes && <div className="text-[11px] text-slate-400 font-normal">{item.notes}</div>}
                    </td>

                    {/* Cap Split % */}
                    <td className="py-3.5 px-3 text-center font-mono tabular-nums text-slate-600 min-w-[80px]">
                      <span className="bg-[#F8F6F1] border border-[#E2E8F0] px-2 py-0.5 rounded text-[11px] font-bold text-[#1A1D20]">
                        {item.recommendedPct ? `${item.recommendedPct}%` : `${itemPctOfBudget}%`}
                      </span>
                    </td>

                    {/* Estimated Cost */}
                    <td className="py-3.5 px-3 min-w-[120px]">
                      <div className="flex items-center gap-1">
                        <span className="text-slate-400 font-mono text-[11px]">{currency}</span>
                        <input
                          type="number"
                          value={item.estimatedCost || ''}
                          onChange={(e) => handleUpdateItemField(item.id, 'estimatedCost', Number(e.target.value))}
                          className="w-24 px-2 py-1 font-mono tabular-nums text-slate-800 bg-[#FAF8F5] border border-[#E2E8F0] rounded-lg focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#D4AF37]"
                        />
                      </div>
                    </td>

                    {/* Actual Cost */}
                    <td className="py-3.5 px-3 min-w-[120px]">
                      <div className="flex items-center gap-1">
                        <span className="text-slate-400 font-mono text-[11px]">{currency}</span>
                        <input
                          type="number"
                          value={item.actualCost || ''}
                          onChange={(e) => handleUpdateItemField(item.id, 'actualCost', Number(e.target.value))}
                          className="w-24 px-2 py-1 font-mono tabular-nums font-bold text-[#1A1D20] bg-white border border-[#E2E8F0] rounded-lg focus:outline-none focus:ring-1 focus:ring-[#D4AF37]"
                        />
                      </div>
                    </td>

                    {/* Advance Paid */}
                    <td className="py-3.5 px-3 min-w-[120px]">
                      <div className="flex items-center gap-1">
                        <span className="text-slate-400 font-mono text-[11px]">{currency}</span>
                        <input
                          type="number"
                          value={item.advancePaid || ''}
                          onChange={(e) => handleUpdateItemField(item.id, 'advancePaid', Number(e.target.value))}
                          className="w-24 px-2 py-1 font-mono tabular-nums text-[#1B4332] font-semibold bg-[#EBF5F0]/50 border border-[#CDE5D8] rounded-lg focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#1B4332]"
                        />
                      </div>
                    </td>

                    {/* Balance Left */}
                    <td className="py-3.5 px-3 font-mono tabular-nums font-bold min-w-[110px]">
                      {remaining === 0 ? (
                        <span className="text-[#1B4332] flex items-center gap-1 text-[11px] font-semibold">
                          <CheckCircle2 className="w-3.5 h-3.5 text-[#1B4332]" />
                          <span>{lang === 'hi' ? 'पूर्ण भुगतान' : 'Paid'}</span>
                        </span>
                      ) : (
                        <span className="text-[#9A813A]">{formatCurrency(remaining, currency)}</span>
                      )}
                    </td>

                    {/* Balance Due Date */}
                    <td className="py-3.5 px-3 min-w-[130px]">
                      <input
                        type="date"
                        value={item.dueDate || ''}
                        onChange={(e) => handleUpdateItemField(item.id, 'dueDate', e.target.value)}
                        className="px-2 py-1 text-[11px] font-mono text-slate-700 border border-[#E2E8F0] rounded-lg bg-white focus:outline-none focus:ring-1 focus:ring-[#D4AF37]"
                      />
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 px-5 text-right">
                      <button
                        onClick={() => handleDeleteItem(item.id)}
                        className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition-colors"
                        title={t.common.delete}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal: Add New Budget Item */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-[#1A1D20]/75 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#FAF8F5] rounded-3xl max-w-md w-full p-6 sm:p-7 shadow-2xl border border-[#D4AF37]/30 relative animate-in fade-in zoom-in-95 duration-150">
            <h3 className="font-serif text-xl font-bold text-[#1A1D20] mb-1">{t.budget.addItem}</h3>
            <p className="text-xs text-slate-500 mb-5">{t.budget.subtitle}</p>

            <form onSubmit={handleAddItem} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-[#1A1D20] mb-1.5">
                  {t.budget.category}
                </label>
                <input
                  type="text"
                  required
                  value={newItemName}
                  onChange={(e) => setNewItemName(e.target.value)}
                  placeholder="e.g. Traditional Dhol & Brass Band, Live Chaat Counter"
                  className="w-full px-3.5 py-2.5 text-sm bg-white rounded-xl border border-[#E2E8F0] focus:outline-none focus:ring-2 focus:ring-[#D4AF37]/30 focus:border-[#D4AF37]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-xs font-bold text-[#1A1D20] mb-1.5">
                    {t.budget.estimatedCost} ({currency})
                  </label>
                  <input
                    type="number"
                    value={newItemEst}
                    onChange={(e) => setNewItemEst(e.target.value)}
                    placeholder="25000"
                    className="w-full px-3 py-2 text-sm font-mono tabular-nums bg-white rounded-xl border border-[#E2E8F0] focus:outline-none focus:ring-2 focus:ring-[#D4AF37]/30 focus:border-[#D4AF37]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#1A1D20] mb-1.5">
                    {t.budget.actualCost} ({currency})
                  </label>
                  <input
                    type="number"
                    value={newItemAct}
                    onChange={(e) => setNewItemAct(e.target.value)}
                    placeholder="23000"
                    className="w-full px-3 py-2 text-sm font-mono tabular-nums font-bold text-[#1A1D20] bg-white rounded-xl border border-[#E2E8F0] focus:outline-none focus:ring-2 focus:ring-[#D4AF37]/30 focus:border-[#D4AF37]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-xs font-bold text-[#1A1D20] mb-1.5">
                    {t.budget.advancePaid} ({currency})
                  </label>
                  <input
                    type="number"
                    value={newItemAdv}
                    onChange={(e) => setNewItemAdv(e.target.value)}
                    placeholder="10000"
                    className="w-full px-3 py-2 text-sm font-mono tabular-nums text-[#1B4332] bg-white rounded-xl border border-[#E2E8F0] focus:outline-none focus:ring-2 focus:ring-[#1B4332]/30 focus:border-[#1B4332]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#1A1D20] mb-1.5">
                    {t.budget.balanceDueDate}
                  </label>
                  <input
                    type="date"
                    value={newItemDue}
                    onChange={(e) => setNewItemDue(e.target.value)}
                    className="w-full px-3 py-2 text-xs font-mono bg-white rounded-xl border border-[#E2E8F0] focus:outline-none focus:ring-2 focus:ring-[#D4AF37]/30 focus:border-[#D4AF37]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#1A1D20] mb-1.5">
                  {t.common.notes} ({t.common.optional})
                </label>
                <input
                  type="text"
                  value={newItemNotes}
                  onChange={(e) => setNewItemNotes(e.target.value)}
                  placeholder="e.g., includes sound technician & generator fuel"
                  className="w-full px-3.5 py-2 text-xs bg-white rounded-xl border border-[#E2E8F0] focus:outline-none focus:ring-2 focus:ring-[#D4AF37]/30 focus:border-[#D4AF37]"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900"
                >
                  {t.common.cancel}
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 text-xs font-bold text-white bg-[#1A1D20] hover:bg-[#2A2F35] rounded-xl shadow-xs border border-[#D4AF37]/30"
                >
                  {t.common.add}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
