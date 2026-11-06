import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center p-6 text-center select-none">
      <div className="eyebrow-motif mb-2">
        <span className="slashes">////</span>
        <span>ERROR 404 · OFF TRACK</span>
      </div>
      <h1 className="hero-solid text-7xl mb-4">404</h1>
      <p className="text-sm text-[#8A8A93] mb-6 font-mono">
        The requested sector or pit-lane does not exist on this circuit.
      </p>
      <Link
        href="/"
        className="px-6 py-2.5 bg-[#CE2F2C] text-white font-condensed font-black text-sm uppercase italic tracking-wider rounded skew-f1 hover:bg-[#E53935]"
      >
        <span className="unskew-f1">RETURN TO PADDOCK →</span>
      </Link>
    </div>
  );
}

