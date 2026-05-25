import { useEffect, useMemo, useState } from "react";
import API from "../services/api";

function Reports() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);

  const mosqueInfo = {
    commission: [
      "Ahmet Brahim Kaçkini",
      "Nexhmedin Musa Geci",
      "Zeqir Hazir Geci",
    ],
    mosque: "Baba Hamëz • Llaushë",
    period: "2022 • 2023 • 2024 • 2025",
    reporter: "Ahmet Brahim Kaçkini",
  };

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    try {
      const res = await API.get("/reports");
      setReports(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.log(err);
      setReports([]);
    } finally {
      setLoading(false);
    }
  };

  const totalAmount = useMemo(() => {
    return reports.reduce((acc, r) => acc + Number(r.amount || 0), 0);
  }, [reports]);

  const formatDate = (date) => {
    if (!date) return "-";
    return new Date(date).toLocaleDateString("sq-AL");
  };

  return (
    <section className="relative py-24 px-4 bg-black text-white overflow-hidden">

      {/* GLOW */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-yellow-400/5 blur-3xl rounded-full" />

      <div className="relative max-w-7xl mx-auto space-y-10">

        {/* HEADER */}
        <div className="text-center space-y-4">
          <div className="inline-flex px-5 py-2 rounded-full border border-yellow-400/20 bg-yellow-400/5 text-yellow-400 text-xs tracking-[0.25em] uppercase">
            📊 Raportet Financiare
          </div>

          <h2 className="text-4xl md:text-5xl font-black">
            Raporti i Xhamisë
          </h2>

          <p className="text-gray-400 max-w-2xl mx-auto">
            Dokumentim transparent i investimeve dhe progresit të projektit.
          </p>
        </div>

        {/* INFO */}
        <div className="grid lg:grid-cols-2 gap-6">

          <div className="bg-white/[0.03] border border-white/10 rounded-3xl p-6">
            <p className="text-yellow-400 text-xs uppercase mb-3">Informacion</p>
            <h3 className="text-xl font-bold">{mosqueInfo.mosque}</h3>
            <p className="text-gray-400">{mosqueInfo.period}</p>
            <p className="text-gray-500">{mosqueInfo.reporter}</p>
          </div>

          <div className="bg-white/[0.03] border border-white/10 rounded-3xl p-6">
            <p className="text-yellow-400 text-xs uppercase mb-3">Komisioni</p>

            {mosqueInfo.commission.map((p, i) => (
              <div key={i} className="flex items-center gap-3 text-sm mb-2">
                <div className="w-7 h-7 rounded-full bg-yellow-400 text-black flex items-center justify-center text-xs font-bold">
                  {i + 1}
                </div>
                {p}
              </div>
            ))}

          </div>

        </div>

        {/* STATS */}
        <div className="grid md:grid-cols-2 gap-6">

          <div className="bg-white/[0.03] border border-white/10 rounded-3xl p-6">
            <p className="text-gray-400 text-sm uppercase">Totali</p>
            <h3 className="text-4xl font-black text-yellow-400 mt-2">
              € {totalAmount.toLocaleString()}
            </h3>
          </div>

          <div className="bg-white/[0.03] border border-white/10 rounded-3xl p-6">
            <p className="text-gray-400 text-sm uppercase">Raporte</p>
            <h3 className="text-4xl font-black text-green-400 mt-2">
              {reports.length}
            </h3>
          </div>

        </div>

        {/* LOADING */}
        {loading ? (
          <div className="text-center py-20 text-gray-500">
            Duke u ngarkuar...
          </div>
        ) : reports.length === 0 ? (
          <div className="text-center py-20 text-gray-400">
            Nuk ka raporte ende
          </div>
        ) : (
          <>
            {/* ================= SAME TABLE FOR ALL DEVICES ================= */}
            <div className="overflow-x-auto">

              <div className="min-w-[900px] bg-white/[0.03] border border-white/10 rounded-3xl">

                {/* HEADER ROW */}
                <div className="grid grid-cols-5 text-xs text-gray-400 border-b border-white/10 p-4">
                  <div>Data</div>
                  <div>Periudha</div>
                  <div>Investimi</div>
                  <div>Përshkrimi</div>
                  <div>Kosto</div>
                </div>

                {/* ROWS */}
                {reports.map((item) => (
                  <div
                    key={item.id}
                    className="grid grid-cols-5 p-4 border-b border-white/5 hover:bg-white/[0.02] text-sm"
                  >

                    <div className="text-gray-300">
                      {formatDate(item.date)}
                    </div>

                    <div className="text-yellow-400">
                      {item.period || "-"}
                    </div>

                    <div className="text-white font-medium">
                      {item.title}
                    </div>

                    <div className="text-gray-400">
                      {item.description || "-"}
                    </div>

                    <div className="text-green-400 font-semibold">
                      € {item.amount}
                    </div>

                  </div>
                ))}

              </div>

            </div>
          </>
        )}

      </div>
    </section>
  );
}

export default Reports;