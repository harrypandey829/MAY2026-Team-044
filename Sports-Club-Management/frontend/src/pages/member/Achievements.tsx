import { useEffect, useState } from 'react';
import { Award, CheckCircle2, FileText, Download, Eye, Sparkles, X } from 'lucide-react';
import MemberLayout from '../../components/member/MemberLayout';
import PageCard from '../../components/member/PageCard';
import authService from '../../services/authService';
import attendanceService from '../../services/attendanceService';
import certificateService, { Certificate } from '../../services/certificateService';

export default function AchievementsPage() {
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [totalAttended, setTotalAttended] = useState<number>(0);
  const [attendancePercentage, setAttendancePercentage] = useState<number>(0);
  const [avgRating, setAvgRating] = useState<string>('–');
  const [loading, setLoading] = useState(true);
  const [selectedCert, setSelectedCert] = useState<Certificate | null>(null);

  const user = authService.getCurrentUser();
  const userSport = user?.sport || 'Badminton';

  useEffect(() => {
    if (!user) return;

    const loadData = async () => {
      try {
        setLoading(true);
        const [certList, attHistory] = await Promise.all([
          certificateService.getMemberCertificates(user.id),
          attendanceService.getMemberHistory(user.id),
        ]);

        setCertificates(certList);

        const presentCount = attHistory.filter((a) => a.attendance_status === 'PRESENT').length;
        const totalCount = attHistory.length;
        setTotalAttended(presentCount);
        setAttendancePercentage(totalCount > 0 ? Math.round((presentCount / totalCount) * 100) : 0);

        const ratedList = attHistory.filter((a: any) => a.rating !== null && a.rating > 0);
        if (ratedList.length > 0) {
          const sum = ratedList.reduce((acc: number, a: any) => acc + a.rating, 0);
          setAvgRating((sum / ratedList.length).toFixed(1));
        }
      } catch {
        setCertificates([]);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [user?.id]);

  return (
    <MemberLayout>
      <section className="rounded-[2rem] border border-sky-200/70 bg-gradient-to-r from-sky-100 via-white to-emerald-50 p-6 text-slate-900 shadow-xl shadow-sky-100/80 sm:p-8">
        <div className="max-w-3xl">
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-brand-700">{userSport} Portfolio</p>
          <h1 className="mt-3 text-3xl font-semibold sm:text-4xl">Achievements & Certificates</h1>
          <p className="mt-3 text-sm leading-7 text-slate-600 sm:text-base">
            Track your milestones, attendance record, coach performance rating, and official certificates.
          </p>
        </div>
      </section>

      {/* STATS OVERVIEW */}
      <div className="mt-6 grid gap-5 md:grid-cols-3">
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center gap-2 text-brand-600">
            <CheckCircle2 className="h-5 w-5" />
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Sessions Attended</span>
          </div>
          <p className="mt-4 text-4xl font-extrabold text-slate-900">{totalAttended}</p>
          <p className="mt-2 text-xs text-slate-500">Completed training sessions & matches</p>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center gap-2 text-emerald-600">
            <Award className="h-5 w-5" />
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Attendance Rate</span>
          </div>
          <p className="mt-4 text-4xl font-extrabold text-slate-900">{attendancePercentage}%</p>
          <p className="mt-2 text-xs text-slate-500">Overall sport attendance reliability</p>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center gap-2 text-amber-500">
            <Sparkles className="h-5 w-5" />
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Overall Rating</span>
          </div>
          <p className="mt-4 text-4xl font-extrabold text-slate-900">{avgRating} <span className="text-lg text-slate-400">/ 10</span></p>
          <p className="mt-2 text-xs text-slate-500">Coach performance score average</p>
        </div>
      </div>

      {/* ISSUED CERTIFICATES */}
      <div className="mt-8">
        <PageCard title="Official Certificates" subtitle="Certificates granted by Coach & Club Administration">
          <div className="grid gap-4 md:grid-cols-2">
            {loading ? (
              <p className="col-span-2 py-8 text-center text-sm text-slate-500">Loading certificates...</p>
            ) : certificates.length === 0 ? (
              <div className="col-span-2 rounded-2xl border border-dashed border-slate-300 p-8 text-center">
                <FileText className="mx-auto h-8 w-8 text-slate-400" />
                <p className="mt-2 text-sm font-medium text-slate-600">No certificates issued yet for {userSport}</p>
              </div>
            ) : (
              certificates.map((cert) => (
                <div key={cert.id} className="rounded-2xl border border-amber-200/80 bg-gradient-to-br from-amber-50/50 via-white to-sky-50/30 p-5 shadow-sm">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-100 text-amber-700">
                        <Award className="h-5 w-5" />
                      </div>
                      <div>
                        <span className="rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-bold text-amber-900">{cert.sport_name}</span>
                        <h3 className="mt-1 text-base font-semibold text-slate-900">{cert.title}</h3>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 text-xs text-slate-500">
                    <p>Issued by: <span className="font-semibold text-slate-800">{cert.issued_by}</span></p>
                    <p className="mt-0.5">Date: {new Date(cert.issued_date).toLocaleDateString()}</p>
                  </div>

                  <div className="mt-5 flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setSelectedCert(cert)}
                      className="inline-flex items-center gap-1.5 rounded-xl bg-brand-600 px-4 py-2 text-xs font-semibold text-white hover:bg-brand-700"
                    >
                      <Eye className="h-3.5 w-3.5" /> View Certificate
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </PageCard>
      </div>

      {/* VIEW CERTIFICATE MODAL */}
      {selectedCert && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
          <div className="relative w-full max-w-2xl rounded-3xl border border-amber-300 bg-gradient-to-b from-amber-50 via-white to-amber-50/40 p-8 shadow-2xl text-slate-900">
            <button
              onClick={() => setSelectedCert(null)}
              className="absolute right-4 top-4 rounded-full bg-slate-100 p-2 text-slate-500 hover:bg-slate-200"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="text-center">
              <Award className="mx-auto h-16 w-16 text-amber-500" />
              <p className="mt-2 text-xs font-extrabold uppercase tracking-[0.3em] text-amber-800">Certificate of Excellence</p>
              <h2 className="mt-4 text-2xl font-extrabold text-slate-900">{selectedCert.title}</h2>

              <p className="mt-6 text-sm text-slate-600">This is to certify that</p>
              <p className="mt-1 text-2xl font-bold text-brand-800">{user?.first_name} {user?.last_name}</p>
              <p className="mt-2 text-sm text-slate-600">
                has successfully achieved high proficiency in <span className="font-bold text-slate-900">{selectedCert.sport_name}</span>.
              </p>

              <div className="mt-8 flex items-center justify-around border-t border-amber-200 pt-6 text-xs text-slate-500">
                <div>
                  <p className="font-bold text-slate-800">{selectedCert.issued_by}</p>
                  <p>Authorized Signature</p>
                </div>
                <div>
                  <p className="font-bold text-slate-800">{new Date(selectedCert.issued_date).toLocaleDateString()}</p>
                  <p>Issue Date</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </MemberLayout>
  );
}
