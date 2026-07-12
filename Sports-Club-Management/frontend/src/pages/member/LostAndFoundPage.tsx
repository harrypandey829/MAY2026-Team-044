import MemberLayout from '../../components/member/MemberLayout';
import LostAndFoundContent from '../../components/lost-and-found/LostAndFoundContent';

export default function MemberLostAndFoundPage() {
  return (
    <MemberLayout>
      <LostAndFoundContent variant="member" />
    </MemberLayout>
  );
}
