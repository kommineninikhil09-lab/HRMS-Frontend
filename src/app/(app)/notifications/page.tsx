import { redirect } from 'next/navigation';

export default function NotificationsRedirect() {
  redirect('/inbox?tab=notifications');
}
