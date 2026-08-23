import { useEffect, useState } from 'react';
import { Package, Clock, CheckCircle2, AlertCircle, RotateCcw } from 'lucide-react';
import MemberLayout from '../../components/member/MemberLayout';
import PageCard from '../../components/member/PageCard';
import authService from '../../services/authService';
import sportsService, { EquipmentUtility } from '../../services/sportsService';
import equipmentService, { EquipmentIssuance } from '../../services/equipmentService';

export default function FacilityBookingPage() {
  // Equipment Utility State
  const [utilities, setUtilities] = useState<EquipmentUtility[]>([]);
  const [issuances, setIssuances] = useState<EquipmentIssuance[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDuration, setSelectedDuration] = useState<number>(2);
  const [issuingId, setIssuingId] = useState<string | null>(null);
  const [returningId, setReturningId] = useState<string | null>(null);

  // Global Banner Feedback
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const user = authService.getCurrentUser();
  const userSport = user?.sport || 'Badminton';

  const loadData = async () => {
    try {
      setLoading(true);
      const utilData = await sportsService.getUtilities(userSport).catch(() => []);
      const issuancesData = await equipmentService.getMyIssuances().catch(() => []);

      setUtilities(Array.isArray(utilData) ? utilData : []);
      setIssuances(Array.isArray(issuancesData) ? issuancesData : []);
    } catch {
      // Safe fallback
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
    const timer = setInterval(loadData, 15000); // refresh every 15s for stock & timers
    return () => clearInterval(timer);
  }, [userSport, user?.id]);

  // Equipment Issue
  const handleIssue = async (equipId: string, equipName: string) => {
    try {
      setIssuingId(equipId);
      setMessage(null);
      await equipmentService.issueEquipment({
        equipment_id: equipId,
        quantity: 1,
        duration_hours: selectedDuration,
      });
      setMessage({ type: 'success', text: `Successfully issued ${equipName} for ${selectedDuration} hours! Available inventory updated (-1).` });
      await loadData();
    } catch (err) {
      setMessage({ type: 'error', text: err instanceof Error ? err.message : 'Failed to issue equipment' });
    } finally {
      setIssuingId(null);
    }
  };

  // Equipment Return
  const handleReturn = async (issuanceId: string, equipName: string) => {
    try {
      setReturningId(issuanceId);
      setMessage(null);
      await equipmentService.returnEquipment(issuanceId);
      setMessage({ type: 'success', text: `Returned ${equipName}. Available inventory stock restored (+1).` });
      await loadData();
    } catch (err) {
      setMessage({ type: 'error', text: err instanceof Error ? err.message : 'Failed to return equipment' });
    } finally {
      setReturningId(null);
    }
  };

  // Helper for countdown
  const getTimeRemainingStr = (expectedReturnIso: string) => {
    const expected = new Date(expectedReturnIso).getTime();
    const now = Date.now();
    const diffMs = expected - now;
    if (diffMs <= 0) return 'Expired / Due Now';
    const mins = Math.floor((diffMs / (1000 * 60)) % 60);
    const hrs = Math.floor(diffMs / (1000 * 60 * 60));
    return `${hrs}h ${mins}m remaining`;
  };

  return (
    <MemberLayout>
      <section className="rounded-[2rem] border border-sky-200/70 bg-gradient-to-r from-sky-100 via-white to-emerald-50 p-6 text-slate-900 shadow-xl shadow-sky-100/80 sm:p-8">
        <div className="max-w-3xl">
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-brand-700">Utility House: {userSport}</p>
          <h1 className="mt-3 text-3xl font-semibold sm:text-4xl">Sport Equipment Utility House</h1>
          <p className="mt-3 text-sm leading-7 text-slate-600 sm:text-base">
            Borrow sport-specific equipment utilities provided for {userSport}. Keep track of your active issuances and return items to restore inventory stock.
          </p>
        </div>
      </section>

      {message && (
        <div
          className={`mt-4 flex items-center gap-2 rounded-xl border p-4 text-sm font-semibold ${
            message.type === 'success'
              ? 'border-emerald-200 bg-emerald-50 text-emerald-800'
              : 'border-red-200 bg-red-50 text-red-800'
          }`}
        >
          {message.type === 'success' ? <CheckCircle2 className="h-5 w-5 text-emerald-600" /> : <AlertCircle className="h-5 w-5 text-red-600" />}
          {message.text}
        </div>
      )}

      {/* UTILITY STOCK SECTION */}
      <div className="mt-6 space-y-8">
        <PageCard title={`${userSport} Utility Stock`} subtitle="Available equipment provided by Admin">
          <div className="mb-4 flex items-center gap-3">
            <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">Select Borrow Duration:</label>
            <select
              value={selectedDuration}
              onChange={(e) => setSelectedDuration(Number(e.target.value))}
              className="rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm font-bold text-slate-800 shadow-sm outline-none"
            >
              {[1, 2, 3, 4, 6, 8, 12].map((hr) => (
                <option key={hr} value={hr}>
                  {hr} {hr === 1 ? 'Hour' : 'Hours'}
                </option>
              ))}
            </select>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {loading ? (
              <p className="col-span-3 py-8 text-center text-sm text-slate-500">Loading equipment stock...</p>
            ) : utilities.length === 0 ? (
              <p className="col-span-3 py-8 text-center text-sm text-slate-500">No equipment utilities currently listed for {userSport}</p>
            ) : (
              utilities.map((item) => {
                const activeIssuance = issuances.find(
                  (iss) => iss.equipment_id === item.id && iss.status === 'ISSUED'
                );
                const isAvailable = item.available_quantity > 0;
                const isProcessing = issuingId === item.id || returningId === activeIssuance?.id;

                return (
                  <div
                    key={item.id}
                    className={`rounded-2xl border p-5 shadow-sm transition-all hover:shadow-md ${
                      activeIssuance ? 'border-amber-300 bg-amber-50/40' : 'border-slate-200/80 bg-white'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <Package className={`h-6 w-6 ${activeIssuance ? 'text-amber-600' : 'text-brand-600'}`} />
                      {activeIssuance ? (
                        <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-extrabold text-amber-800">
                          Booked by You
                        </span>
                      ) : (
                        <span
                          className={`rounded-full px-3 py-1 text-xs font-extrabold ${
                            isAvailable ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                          }`}
                        >
                          {item.available_quantity} / {item.total_quantity} Available
                        </span>
                      )}
                    </div>

                    <h3 className="mt-4 text-base font-bold text-slate-900">{item.name}</h3>
                    <p className="mt-1 text-xs text-slate-500">Sport: {item.sport_name}</p>

                    {activeIssuance ? (
                      <div className="mt-4 space-y-2">
                        <p className="text-xs font-semibold text-amber-900">
                          Time remaining: <span className="font-bold">{getTimeRemainingStr(activeIssuance.expected_return_at)}</span>
                        </p>
                        <button
                          type="button"
                          disabled={isProcessing}
                          onClick={() => handleReturn(activeIssuance.id, item.name)}
                          className="inline-flex items-center justify-center gap-1.5 w-full rounded-xl bg-amber-600 py-2.5 text-xs font-bold text-white shadow-sm hover:bg-amber-700 transition-all"
                        >
                          <RotateCcw className="h-3.5 w-3.5" />
                          {returningId === activeIssuance.id ? 'Returning…' : 'Return Equipment Now'}
                        </button>
                      </div>
                    ) : (
                      <button
                        type="button"
                        disabled={!isAvailable || isProcessing}
                        onClick={() => handleIssue(item.id, item.name)}
                        className={`mt-5 w-full rounded-xl py-2.5 text-xs font-bold transition-all shadow-sm ${
                          isAvailable
                            ? 'bg-gradient-to-r from-brand-600 to-emerald-600 text-white hover:opacity-95 hover:scale-[1.01]'
                            : 'cursor-not-allowed bg-slate-100 text-slate-400'
                        }`}
                      >
                        {isProcessing ? 'Processing…' : isAvailable ? `Issue Equipment (${selectedDuration}h)` : 'Out of Stock'}
                      </button>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </PageCard>

        {/* MY BORROWED EQUIPMENT LOG */}
        <PageCard title="My Borrowed Equipment Log" subtitle="Track your active equipment issuances and countdown timers">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-600">
              <thead className="bg-slate-100/80 text-xs font-semibold uppercase text-slate-500">
                <tr>
                  <th className="px-4 py-3">Equipment</th>
                  <th className="px-4 py-3">Sport</th>
                  <th className="px-4 py-3">Issued At</th>
                  <th className="px-4 py-3">Time Remaining</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {issuances.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-8 text-center text-xs text-slate-400">
                      No borrowed equipment history found.
                    </td>
                  </tr>
                ) : (
                  issuances.map((iss) => {
                    const isIssued = iss.status === 'ISSUED';
                    const isProcessing = returningId === iss.id;
                    const timeStr = isIssued ? getTimeRemainingStr(iss.expected_return_at) : 'Completed';
                    const equipName = utilities.find((u) => u.id === iss.equipment_id)?.name || 'Sport Equipment';
                    return (
                      <tr key={iss.id} className="hover:bg-slate-50">
                        <td className="px-4 py-3 font-semibold text-slate-900">{equipName}</td>
                        <td className="px-4 py-3">{iss.sport_name}</td>
                        <td className="px-4 py-3 text-xs">{new Date(iss.issued_at).toLocaleString()}</td>
                        <td className="px-4 py-3 text-xs font-bold text-brand-700">{timeStr}</td>
                        <td className="px-4 py-3">
                          <span
                            className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-bold ${
                              iss.status === 'ISSUED'
                                ? 'bg-amber-100 text-amber-800'
                                : iss.status === 'RETURNED'
                                ? 'bg-emerald-100 text-emerald-800'
                                : 'bg-rose-100 text-rose-800'
                            }`}
                          >
                            <Clock className="h-3 w-3" />
                            {iss.status}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-right">
                          {isIssued && (
                            <button
                              type="button"
                              disabled={isProcessing}
                              onClick={() => handleReturn(iss.id, equipName)}
                              className="inline-flex items-center gap-1.5 rounded-lg bg-amber-600 px-3 py-1 text-xs font-semibold text-white hover:bg-amber-700 shadow-sm"
                            >
                              <RotateCcw className="h-3 w-3" />
                              {isProcessing ? 'Returning…' : 'Return Now'}
                            </button>
                          )}
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </PageCard>
      </div>
    </MemberLayout>
  );
}
