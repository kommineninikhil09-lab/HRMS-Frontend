import { redirect } from 'next/navigation';

export default function MeExpensesRedirect() {
  redirect('/payslips?tab=expenses');
}
