import { Settings as SettingsIcon, Sparkles } from 'lucide-react';
import MemberLayout from '../../components/member/MemberLayout';
import PageCard from '../../components/member/PageCard';

export default function SettingsPage() {
  return (
    <MemberLayout>
      <section className="rounded-[2rem] border border-sky-200/70 bg-gradient-to-r from-sky-100 via-white to-emerald-50 p-6 text-slate-900 shadow-xl shadow-sky-100/80 sm:p-8">
        <div className="max-w-3xl">
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-brand-700">Portal</p>
          <h1 className="mt-3 text-3xl font-semibold sm:text-4xl">Settings</h1>
          <p className="mt-3 text-sm leading-7 text-slate-600 sm:text-base">Adjust your notification and portal preferences to match the way you train and stay updated.</p>
        </div>
      </section>

      <PageCard title="Preferences" subtitle="Portal controls">
        <div className="grid gap-3">
          {['Email reminders', 'Push notifications', 'Weekly summary', 'Event updates'].map((setting) => (
            <div key={setting} className="flex items-center justify-between rounded-[1.2rem] border border-slate-200/70 bg-slate-50/80 p-4">
              <p className="text-sm font-semibold text-slate-800">{setting}</p>
              <button type="button" className="rounded-full border border-slate-200 bg-white px-3 py-1.5 text-sm font-semibold text-slate-700">On</button>
            </div>
          ))}
        </div>
        <div className="mt-4 rounded-[1.2rem] border border-sky-200 bg-sky-50/80 p-4 text-sm text-slate-700">
          <div className="flex items-center gap-2"><Sparkles className="h-4 w-4 text-brand-600" /> These controls are currently managed in this demo experience.</div>
        </div>
      </PageCard>

      <PageCard title="Configuration" subtitle="Club preferences">
        <div className="rounded-[1.4rem] border border-slate-200/70 bg-slate-50/80 p-4">
          <div className="flex items-center gap-2 text-brand-700"><SettingsIcon className="h-4 w-4" /> Default view</div>
          <p className="mt-3 text-sm text-slate-600">Your portal opens on the dashboard by default and keeps your last visited section accessible in the sidebar.</p>
        </div>
      </PageCard>
    </MemberLayout>
  );
}
