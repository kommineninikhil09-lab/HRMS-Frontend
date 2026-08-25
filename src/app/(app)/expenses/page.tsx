import { redirect } from 'next/navigation';

export default function ExpensesRedirect() {
  redirect('/payslips?tab=expenses');
}
