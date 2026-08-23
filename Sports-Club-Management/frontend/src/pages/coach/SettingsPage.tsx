import { useState } from 'react';
import { CheckCircle2, Sparkles, X } from 'lucide-react';
import CoachPortalLayout from '../../components/coach-dashboard/CoachPortalLayout';

export default function SettingsPage() {
  const [preferences, setPreferences] = useState<Record<string, boolean>>({
    'Training Session Broadcasts': true,
    'Match Result Alerts': true,
    'Athlete Availability Email Digest': true,
  });

  const [feedback, setFeedback] = useState<string | null>(null);

  const togglePreference = (setting: string) => {
    setPreferences((prev) => ({ ...prev, [setting]: !prev[setting] }));
  };

  function handleSave() {
    setFeedback('Portal preferences saved successfully!');
    setTimeout(() => setFeedback(null), 4000);
  }

  return (
    <CoachPortalLayout>
      <section className="rounded-[2rem] border border-sky-200/70 bg-gradient-to-r from-sky-100 via-white to-emerald-50 p-6 text-slate-900 shadow-xl shadow-sky-100/80 sm:p-8">
        <div className="max-w-3xl">
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-brand-700">Coach Portal</p>
          <h1 className="mt-3 text-3xl font-semibold sm:text-4xl">Settings</h1>
          <p className="mt-3 text-sm leading-7 text-slate-600 sm:text-base">Configure your coach portal notification broadcasts, alert rules, and layout preferences.</p>
        </div>
      </section>

      {feedback && (
        <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-5 py-3.5 text-sm font-semibold text-emerald-800 flex items-center justify-between">
          <span className="flex items-center gap-2"><CheckCircle2 className="h-5 w-5 text-emerald-600" /> {feedback}</span>
          <button type="button" onClick={() => setFeedback(null)}><X className="h-4 w-4 text-emerald-700" /></button>
        </div>
      )}

      <section className="grid gap-4 xl:grid-cols-[1.05fr_0.95fr]">
        <div className="rounded-[2rem] border border-white/70 bg-white/80 p-5 shadow-xl shadow-slate-900/5 backdrop-blur-xl">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.25em] text-brand-600">Preferences</p>
              <h2 className="mt-2 text-xl font-semibold text-slate-900">Notification & Broadcast Controls</h2>
            </div>
          </div>
          <div className="mt-5 grid gap-3">
            {Object.keys(preferences).map((item) => (
              <div key={item} className="flex items-center justify-between rounded-[1.2rem] border border-slate-200/70 bg-slate-50/80 p-4 text-sm font-semibold text-slate-700">
                {item}
                <button
                  type="button"
                  onClick={() => togglePreference(item)}
                  className={`rounded-full px-4 py-1.5 text-sm font-semibold transition-all ${
                    preferences[item]
                      ? 'bg-gradient-to-r from-brand-500 to-emerald-500 text-white shadow-md'
                      : 'border border-slate-200 bg-white text-slate-600'
                  }`}
                >
                  {preferences[item] ? 'Enabled' : 'Disabled'}
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-[2rem] border border-white/70 bg-white/80 p-5 shadow-xl shadow-slate-900/5 backdrop-blur-xl">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.25em] text-brand-600">Save Configuration</p>
              <h2 className="mt-2 text-xl font-semibold text-slate-900">Apply Settings</h2>
            </div>
          </div>
          <div className="mt-5 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={handleSave}
              className="rounded-full bg-gradient-to-r from-brand-500 to-emerald-500 px-6 py-2.5 text-sm font-semibold text-white shadow-lg transition-all hover:scale-105"
            >
              Save Preferences
            </button>
          </div>
          <div className="mt-4 rounded-[1.2rem] border border-sky-200 bg-sky-50/80 p-4 text-sm text-slate-700">
            <div className="flex items-center gap-2"><Sparkles className="h-4 w-4 text-brand-600" /> Preference changes take effect immediately across all active coach portal sessions.</div>
          </div>
        </div>
      </section>
    </CoachPortalLayout>
  );
}
