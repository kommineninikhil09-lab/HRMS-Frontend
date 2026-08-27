import { redirect } from 'next/navigation';

export default function ApplyLeaveRedirect() {
  redirect('/leave?action=apply');
}
