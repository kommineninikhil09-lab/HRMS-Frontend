import { redirect } from 'next/navigation';

export default function ApplyLeaveRedirect() {
  redirect('/me/leaves?action=apply');
}
