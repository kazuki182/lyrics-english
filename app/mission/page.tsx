import Link from "next/link";

export default function MissionPage() {
  return (
    <div className="space-y-5">
      <section className="card p-6 text-center">
        <p className="text-sm font-bold text-muted">MISSION REMOVED</p>
        <h1 className="mt-2 text-3xl font-bold">Today's plan is now on Home.</h1>
        <p className="mt-3 text-muted">Daily missions have been merged into the learning countdown and verb mastery flow.</p>
        <div className="mt-6 grid gap-3">
          <Link href="/" className="btn btn-primary block">Home</Link>
          <Link href="/tests" className="btn btn-soft block">Verb Tests</Link>
        </div>
      </section>
    </div>
  );
}
