import { useEffect, useState } from "react";
import API from "../services/api";

function DonorsSection() {
  const [donors, setDonors] = useState([]);

  useEffect(() => {
    fetchDonors();
  }, []);

  const fetchDonors = async () => {
    const res = await API.get("/donors");
    setDonors(res.data);
  };

  return (
    <section id="donors" className="max-w-6xl mx-auto px-6 py-24">

      {/* HEADER */}
      <div className="mb-10 text-center">
        <h2 className="text-5xl font-extrabold tracking-tight bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
          Donatorët
        </h2>
        <p className="text-gray-400 mt-3">
          Lista e të gjithë kontribuesve për Xhami.
        </p>
      </div>

      {/* TABLE WRAPPER */}
      <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl shadow-2xl overflow-hidden">

        <div className="overflow-x-auto">

          <table className="w-full text-sm">

            {/* HEADER */}
            <thead className="bg-white/10 text-gray-300 uppercase text-xs tracking-wider">
              <tr>
                <th className="p-4 text-left">Donatori</th>
                <th className="p-4 text-left">Përshkrimi</th>
                <th className="p-4 text-left">Shuma</th>
              </tr>
            </thead>

            {/* BODY */}
            <tbody>
              {donors.length === 0 ? (
                <tr>
                  <td colSpan="3" className="text-center p-10 text-gray-400">
                    Nuk ka donatorë ende
                  </td>
                </tr>
              ) : (
                donors.map((d) => (
                  <tr
                    key={d.id}
                    className="border-t border-white/5 hover:bg-white/10 transition duration-300"
                  >

                    {/* NAME */}
                    <td className="p-5 font-semibold text-white">
                      {d.name} {d.surname}
                    </td>

                    {/* DESCRIPTION */}
                    <td className="p-5 text-gray-400">
                      {d.description}
                    </td>

                    {/* AMOUNT */}
                    <td className="p-5">
                      <span className="px-3 py-1 rounded-full bg-yellow-500/10 text-yellow-400 border border-yellow-500/30 font-bold">
                        {d.amount}€
                      </span>
                    </td>

                  </tr>
                ))
              )}
            </tbody>

          </table>

        </div>
      </div>

    </section>
  );
}

export default DonorsSection;