import { redirect } from 'next/navigation';

export default function ApplyLeaveRedirect() {
  redirect('/me/attendance?tab=leave&action=apply');
}
