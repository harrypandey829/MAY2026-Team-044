import CoachPortalLayout from '../../components/coach-dashboard/CoachPortalLayout';
import LostAndFoundContent from '../../components/lost-and-found/LostAndFoundContent';

export default function CoachLostAndFoundPage() {
  return (
    <CoachPortalLayout>
      <LostAndFoundContent variant="coach" />
    </CoachPortalLayout>
  );
}
