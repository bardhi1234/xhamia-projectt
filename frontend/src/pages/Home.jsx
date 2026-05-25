import { useEffect, useState } from "react";
import API from "../services/api";

import Navbar from "../components/Navbar";
import InvestmentSection from "../components/InvestmentSection";
import DonorsSection from "../components/DonorsSection";
import ReportsSection from "../components/ReportsSection";

function Home() {
  const [investments, setInvestments] = useState([]);
  const [reports, setReports] = useState([]);
  const [donors, setDonors] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [invRes, repRes, donRes] = await Promise.all([
        API.get("/investments"),
        API.get("/reports"),
        API.get("/donors"),
      ]);

      setInvestments(invRes.data || []);
      setReports(repRes.data || []);
      setDonors(donRes.data || []);
    } catch (err) {
      console.log(err);
      setInvestments([]);
      setReports([]);
      setDonors([]);
    } finally {
      setLoading(false);
    }
  };

  const externalBefore = investments.filter(
    (i) => i?.type === "jashtem" && i?.stage === "para"
  );

  const externalAfter = investments.filter(
    (i) => i?.type === "jashtem" && i?.stage === "pas"
  );

  const internalBefore = investments.filter(
    (i) => i?.type === "mbrendshem" && i?.stage === "para"
  );

  const internalAfter = investments.filter(
    (i) => i?.type === "mbrendshem" && i?.stage === "pas"
  );

  const scrollTo = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="bg-black text-white min-h-screen overflow-x-hidden">
      <Navbar />

      {/* HERO */}
      <section className="relative h-[85vh] flex items-center justify-center">
        <img
          src="https://res.cloudinary.com/day2i2nmc/image/upload/q_auto/f_auto/v1779397956/xhamiaheroimg_uuhfgu.jpg"
          className="absolute inset-0 w-full h-full object-cover"
          alt=""
        />
        <div className="absolute inset-0 bg-black/80" />

        <div className="relative z-10 text-center max-w-2xl px-4">
          <div className="inline-block px-3 py-1 mb-4 rounded-full border border-yellow-400/20 bg-yellow-400/5 text-yellow-400 text-[10px] tracking-[0.25em] uppercase">
            Platformë Zyrtare
          </div>

          <h1 className="text-3xl md:text-5xl font-semibold">
            Xhamia{" "}
            <span className="text-yellow-400 font-bold">Baba Hamëz</span>
          </h1>

          <p className="mt-3 text-sm text-gray-400">
            Transparencë e plotë e investimeve dhe raportim i vazhdueshëm.
          </p>

          {/* BUTTONS NAV */}
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <button
              onClick={() => scrollTo("external")}
              className="px-4 py-2 rounded-full bg-yellow-400 text-black text-sm"
            >
              Jashtme
            </button>

            <button
              onClick={() => scrollTo("internal")}
              className="px-4 py-2 rounded-full border border-white/10 text-white text-sm"
            >
              Brendshme
            </button>

            <button
              onClick={() => scrollTo("reports")}
              className="px-4 py-2 rounded-full border border-white/10 text-white text-sm"
            >
              Raportet
            </button>

            <button
              onClick={() => scrollTo("donors")}
              className="px-4 py-2 rounded-full border border-white/10 text-white text-sm"
            >
              Donatorët
            </button>
          </div>
        </div>
      </section>

      {/* CONTENT */}
      {loading ? (
        <div className="py-20 text-center text-gray-500 text-sm">
          Duke u ngarkuar...
        </div>
      ) : (
        <div className="space-y-10 py-10 max-w-6xl mx-auto px-4">

          {/* EXTERNAL */}
          <section id="external" className="space-y-6">
            <h2 className="text-center text-yellow-400">
              Investimet e Jashtme
            </h2>

            <InvestmentSection title="Para Investimit" investments={externalBefore} />
            <InvestmentSection title="Pas Investimit" investments={externalAfter} />
          </section>

          {/* INTERNAL */}
          <section id="internal" className="space-y-6">
            <h2 className="text-center text-yellow-400">
              Investimet e Brendshme
            </h2>

            <InvestmentSection title="Para Investimit" investments={internalBefore} />
            <InvestmentSection title="Pas Investimit" investments={internalAfter} />
          </section>

          {/* REPORTS */}
          <section id="reports" className="space-y-6 border-t border-white/10 pt-10">
            <ReportsSection reports={reports} />
          </section>

        </div>
      )}

      {/* DONORS */}
      <section id="donors" className="border-t border-white/10 py-10">
        <DonorsSection />
      </section>
    </div>
  );
}

export default Home;