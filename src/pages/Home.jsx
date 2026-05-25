import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import API from "../services/api";

import Navbar from "../components/Navbar";
import InvestmentSection from "../components/InvestmentSection";
import DonorsSection from "../components/DonorsSection";
import ReportsSection from "../components/ReportsSection";

const container = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.12,
    },
  },
};

const fadeUp = {
  hidden: { opacity: 0, y: 40, scale: 0.98 },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.6, ease: "easeOut" },
  },
};

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
    } finally {
      setLoading(false);
    }
  };

  const externalBefore = investments.filter(i => i?.type === "jashtem" && i?.stage === "para");
  const externalAfter = investments.filter(i => i?.type === "jashtem" && i?.stage === "pas");

  const internalBefore = investments.filter(i => i?.type === "mbrendshem" && i?.stage === "para");
  const internalAfter = investments.filter(i => i?.type === "mbrendshem" && i?.stage === "pas");

  const stats = [
    { label: "Investime", value: investments.length },
    { label: "Donatorë", value: donors.length },
    { label: "Raporte", value: reports.length },
  ];

  const scrollTo = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  const navButtons = [
    { id: "external", label: "Investime të Jashtme" },
    { id: "internal", label: "Investime të Brendshme" },
    { id: "reports", label: "Raporte" },
    { id: "donors", label: "Donatorë" },
  ];

  return (
    <div className="bg-black text-white min-h-screen overflow-x-hidden">
      <Navbar />

      {/* HERO */}
      <section className="relative min-h-screen flex items-center justify-center">

        <img
          src="https://res.cloudinary.com/day2i2nmc/image/upload/q_auto/f_auto/v1779397956/xhamiaheroimg_uuhfgu.jpg"
          className="absolute inset-0 w-full h-full object-cover scale-110"
          alt=""
        />

        <div className="absolute inset-0 bg-black/85" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/80 to-black" />

        {/* glow */}
        <div className="absolute w-[600px] h-[600px] bg-yellow-500/20 blur-[160px] top-[-200px] left-[-200px]" />
        <div className="absolute w-[600px] h-[600px] bg-yellow-500/10 blur-[160px] bottom-[-200px] right-[-200px]" />

        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="relative z-10 text-center max-w-5xl px-6"
        >

          <motion.div variants={fadeUp} className="inline-flex px-6 py-2 mb-6 rounded-full border border-yellow-400/20 bg-yellow-400/5 text-yellow-400 text-[11px] tracking-[0.4em] uppercase backdrop-blur">
            PLATFORMË TRANSPARENCE
          </motion.div>

          <motion.h1 variants={fadeUp} className="text-6xl md:text-8xl font-extrabold leading-tight">
            Xhamia{" "}
            <span className="text-yellow-400">
              Baba Hamëz
            </span>
          </motion.h1>

          <motion.p variants={fadeUp} className="mt-6 text-gray-400 max-w-2xl mx-auto text-base md:text-lg">
            Sistem modern për menaxhimin e investimeve, donacioneve dhe raporteve me transparencë të plotë.
          </motion.p>

          {/* STATS */}
          <motion.div variants={fadeUp} className="mt-14 grid grid-cols-3 gap-4 max-w-2xl mx-auto">
            {stats.map((s, i) => (
              <motion.div
                key={i}
                whileHover={{ scale: 1.08, y: -5 }}
                className="bg-white/5 border border-white/10 rounded-2xl p-5"
              >
                <p className="text-4xl font-bold text-yellow-400">{s.value}</p>
                <p className="text-xs text-gray-400 mt-1">{s.label}</p>
              </motion.div>
            ))}
          </motion.div>

          {/* NAV BUTTONS (SHQIP) */}
          <motion.div variants={fadeUp} className="mt-12 flex flex-wrap justify-center gap-3">
            {navButtons.map((btn) => (
              <button
                key={btn.id}
                onClick={() => scrollTo(btn.id)}
                className="px-7 py-2 rounded-full bg-white/5 border border-white/10 hover:bg-yellow-400 hover:text-black transition hover:scale-110"
              >
                {btn.label}
              </button>
            ))}
          </motion.div>

        </motion.div>
      </section>

      {/* CONTENT */}
      {loading ? (
        <div className="py-40 text-center text-gray-500 animate-pulse">
          Duke u ngarkuar...
        </div>
      ) : (
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          variants={container}
          className="max-w-6xl mx-auto px-4 py-28 space-y-32"
        >

          {/* EXTERNAL */}
          <motion.section variants={fadeUp} id="external">
            <h2 className="text-center text-4xl font-bold text-yellow-400 mb-10">
              Investimet e Jashtme
            </h2>

            <InvestmentSection title="Para Investimit" investments={externalBefore} />
            <InvestmentSection title="Pas Investimit" investments={externalAfter} />
          </motion.section>

          {/* INTERNAL */}
          <motion.section variants={fadeUp} id="internal">
            <h2 className="text-center text-4xl font-bold text-yellow-400 mb-10">
              Investimet e Brendshme
            </h2>

            <InvestmentSection title="Para Investimit" investments={internalBefore} />
            <InvestmentSection title="Pas Investimit" investments={internalAfter} />
          </motion.section>

          {/* REPORTS */}
          <motion.section variants={fadeUp} id="reports">
            <h2 className="text-center text-4xl font-bold text-yellow-400 mb-10">
              Raportet
            </h2>

            <ReportsSection reports={reports} />
          </motion.section>

        </motion.div>
      )}

      {/* DONORS */}
      <motion.section id="donors" className="border-t border-white/10 py-28">
        <div className="max-w-6xl mx-auto px-4">
          <motion.h2 className="text-center text-4xl font-bold text-yellow-400 mb-12">
            Donatorët
          </motion.h2>

          <DonorsSection />
        </div>
      </motion.section>
    </div>
  );
}

export default Home;