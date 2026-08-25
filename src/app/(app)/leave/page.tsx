import { redirect } from 'next/navigation';

export default function LeaveRedirect() {
  redirect('/me/attendance?tab=leave');
}
