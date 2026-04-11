import Link from 'next/link';
import { Leaf } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="bg-[#FFFDF8] text-[#1F2937] min-h-screen flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <div className="flex items-center justify-center gap-2 mb-6">
          <div className="w-10 h-10 bg-[#B45309] rounded-xl flex items-center justify-center">
            <Leaf className="w-5 h-5 text-white" aria-hidden="true" />
          </div>
          <span className="font-black text-[#1F2937] text-lg">CalmKids Academy</span>
        </div>

        <h1 className="text-6xl font-black text-[#B45309] mb-4">404</h1>
        <p className="text-lg text-[#1F2937] mb-2 font-semibold">Page not found</p>
        <p className="text-sm text-[#6B7280] mb-8">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>

        <div className="flex items-center justify-center gap-3">
          <Link
            href="/"
            className="px-5 py-3 rounded-xl font-bold text-[#1F2937] bg-gray-100 hover:bg-gray-200 transition text-sm"
          >
            Go to Home
          </Link>
          <Link
            href="/pricing"
            className="px-5 py-3 rounded-xl font-bold text-white bg-[#B45309] hover:bg-[#92400E] transition text-sm"
          >
            See Pricing
          </Link>
        </div>
      </div>
    </div>
  );
}
