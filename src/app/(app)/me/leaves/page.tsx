import { redirect } from 'next/navigation';

export default function MeLeavesRedirect({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const action = searchParams?.action;
  redirect(action === 'apply' ? '/me/attendance?tab=leave&action=apply' : '/me/attendance?tab=leave');
}
