import MemberLayout from '../../components/member/MemberLayout';
import LostAndFoundContent from '../../components/lost-and-found/LostAndFoundContent';

export default function LostAndFoundPage() {
  return (
    <MemberLayout>
      <LostAndFoundContent variant="member" />
    </MemberLayout>
  );
}
