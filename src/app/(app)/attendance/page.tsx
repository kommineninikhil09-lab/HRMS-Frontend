import { redirect } from 'next/navigation';

export default function AttendanceRedirect() {
  redirect('/me/attendance');
}
