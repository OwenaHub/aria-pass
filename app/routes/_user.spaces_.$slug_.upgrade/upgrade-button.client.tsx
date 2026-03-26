import { PaystackButton } from "react-paystack";

export default function UpgradeButton({ componentProps }: { componentProps: any }) {
  return (
    <PaystackButton
      className="w-full group relative flex items-center justify-center gap-3 bg-primary-theme hover:bg-indigo-700 text-white font-semibold tracking-tighter py-5 rounded-2xl transition-all active:scale-95 shadow-xl shadow-indigo-200"
      {...componentProps}
    />
  )
}
