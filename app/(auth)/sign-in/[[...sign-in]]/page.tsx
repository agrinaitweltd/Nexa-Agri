
import { SignIn } from "@clerk/nextjs";
import { NexaLogo } from "../../../../components/NexaLogo";

export default function SignInPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-950 p-6">
      <div className="mb-10 animate-in fade-in slide-in-from-top-4 duration-700">
        <NexaLogo className="h-12" light />
      </div>
      <SignIn 
        appearance={{
          elements: {
            formButtonPrimary: 'bg-emerald-600 hover:bg-emerald-700 text-sm font-black uppercase tracking-widest',
            card: 'bg-white rounded-[2rem] shadow-2xl border-none',
            headerTitle: 'text-2xl font-black tracking-tight text-slate-900',
            headerSubtitle: 'text-slate-500 font-medium'
          }
        }}
      />
      <p className="mt-12 text-[10px] font-black text-slate-500 uppercase tracking-[0.4em]">
        Secured by NexaShield Intelligence
      </p>
    </div>
  );
}
