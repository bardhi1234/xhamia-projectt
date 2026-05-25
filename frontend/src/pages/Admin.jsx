import { useEffect, useState } from "react";
import API from "../services/api";

function Admin() {
  const [investments, setInvestments] = useState([]);
  const [donors, setDonors] = useState([]);
  const [reports, setReports] = useState([]);

  // ================= INVESTMENTS =================
  const [type, setType] = useState("jashtem");
  const [stage, setStage] = useState("para");
  const [files, setFiles] = useState([]);
  const [editId, setEditId] = useState(null);

  // ================= DONORS =================
  const [dName, setDName] = useState("");
  const [dAmount, setDAmount] = useState("");
  const [dDescription, setDDescription] = useState("");
  const [dEditId, setDEditId] = useState(null);

  // ================= REPORTS =================
  const [rTitle, setRTitle] = useState("");
  const [rAmount, setRAmount] = useState("");
  const [rDate, setRDate] = useState("");
  const [rPeriod, setRPeriod] = useState("");
  const [rEditId, setREditId] = useState(null);

  useEffect(() => {
    fetchInvestments();
    fetchDonors();
    fetchReports();
  }, []);

  // ================= FETCH =================
  const fetchInvestments = async () => {
    try {
      const res = await API.get("/investments");
      setInvestments(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.log(err);
    }
  };

  const fetchDonors = async () => {
    try {
      const res = await API.get("/donors");
      setDonors(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.log(err);
    }
  };

  const fetchReports = async () => {
    try {
      const res = await API.get("/reports");
      setReports(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.log(err);
    }
  };

  // ================= RESET =================
  const resetInvestment = () => {
  setType("jashtem");
  setStage("para");
  setFiles([]);   // ✅ KJO
  setEditId(null);
};
const editInvestment = (item) => {
  setEditId(item.id);
  setType(item.type || "jashtem");
  setStage(item.stage || "para");
};
const deleteInvestment = async (id) => {
  try {
    await API.delete(`/investments/${id}`);
    fetchInvestments();
  } catch (err) {
    console.log(err);
  }
};

  const resetDonor = () => {
    setDName("");
    setDAmount("");
    setDDescription("");
    setDEditId(null);
  };

  const resetReport = () => {
    setRTitle("");
    setRAmount("");
    setRDate("");
    setRPeriod("");
    setREditId(null);
  };

  // ================= INVESTMENTS =================
const handleInvestment = async (e) => {
  e.preventDefault();

  if (files.length === 0) {
    alert("Zgjedh të paktën një foto!");
    return;
  }

  try {
    const formData = new FormData();

    formData.append("type", type);
    formData.append("stage", stage);

    // 👉 MULTIPLE FILES
    files.forEach((file) => {
      formData.append("images", file); // IMPORTANT: "images"
    });

    if (!editId) {
      await API.post("/investments", formData);
    } else {
      await API.put(`/investments/${editId}`, formData);
    }

    setFiles([]);
    resetInvestment();
    fetchInvestments();

  } catch (err) {
    console.log(err);
    alert("Gabim gjatë upload!");
  }
};

  // ================= DONORS =================
  const handleDonor = async (e) => {
    e.preventDefault();

    if (!dName || !dAmount) {
      alert("Plotëso emrin dhe shumën!");
      return;
    }

    try {
      const payload = {
        name: dName,
        amount: Number(dAmount),
        description: dDescription,
      };

      if (!dEditId) {
        await API.post("/donors", payload);
      } else {
        await API.put(`/donors/${dEditId}`, payload);
      }

      resetDonor();
      fetchDonors();

    } catch (err) {
      console.log(err);
    }
  };

  const deleteDonor = async (id) => {
    try {
      await API.delete(`/donors/${id}`);
      fetchDonors();
    } catch (err) {
      console.log(err);
    }
  };

  const editDonor = (item) => {
    setDEditId(item.id);
    setDName(item.name || "");
    setDAmount(item.amount || "");
    setDDescription(item.description || "");
  };

  // ================= REPORTS =================
  const handleReport = async (e) => {
    e.preventDefault();

    if (!rTitle || !rAmount || !rDate) {
      alert("Plotëso të dhënat!");
      return;
    }

    try {
      const payload = {
        title: rTitle,
        amount: Number(rAmount),
        date: rDate,
        period: rPeriod,
      };

      if (!rEditId) {
        await API.post("/reports", payload);
      } else {
        await API.put(`/reports/${rEditId}`, payload);
      }

      resetReport();
      fetchReports();

    } catch (err) {
      console.log(err);
    }
  };

  const deleteReport = async (id) => {
    try {
      await API.delete(`/reports/${id}`);
      fetchReports();
    } catch (err) {
      console.log(err);
    }
  };

  const editReport = (item) => {
    setREditId(item.id);
    setRTitle(item.title || "");
    setRAmount(item.amount || "");
    setRDate(item.date || "");
    setRPeriod(item.period || "");
  };

  return (
    <div className="min-h-screen bg-black text-white px-4 md:px-8 py-10">

      {/* HEADER */}
      <div className="max-w-7xl mx-auto mb-14">

        <div className="flex items-center justify-between flex-wrap gap-4">

          <div>
            <p className="text-yellow-400 uppercase tracking-[4px] text-xs">
              Dashboard
            </p>

            <h1 className="text-4xl md:text-5xl font-bold mt-2">
              Admin Panel
            </h1>
          </div>

          <div className="hidden md:flex items-center gap-3">
            <div className="w-3 h-3 rounded-full bg-green-500 animate-pulse"></div>

            <span className="text-gray-400 text-sm">
              System Active
            </span>
          </div>

        </div>

      </div>

      <div className="max-w-7xl mx-auto space-y-10">

        {/* ================= INVESTMENTS ================= */}
        <div className="bg-white/[0.03] border border-white/10 rounded-3xl p-6">

          <div className="mb-8">
            <h2 className="text-2xl font-bold">
              Investimet
            </h2>

            <p className="text-gray-400 mt-2 text-sm">
              Upload foto para dhe pas investimit
            </p>
          </div>

          <form
            onSubmit={handleInvestment}
            className="grid md:grid-cols-4 gap-4"
          >

            <select
              value={type}
              onChange={(e) => setType(e.target.value)}
              className="bg-zinc-900 border border-white/10 rounded-xl p-3"
            >
              <option value="jashtem">
                Jashtëm
              </option>

              <option value="mbrendshem">
                Mbrendshëm
              </option>
            </select>

            <select
              value={stage}
              onChange={(e) => setStage(e.target.value)}
              className="bg-zinc-900 border border-white/10 rounded-xl p-3"
            >
              <option value="para">
                Para Investimit
              </option>

              <option value="pas">
                Pas Investimit
              </option>
            </select>

            <input
  type="file"
  accept="image/*"
  multiple
  onChange={(e) => setFiles([...e.target.files])}
  className="bg-zinc-900 border border-white/10 rounded-xl p-3"
/>

            <button
              className="bg-yellow-400 hover:bg-yellow-300 transition text-black font-semibold rounded-xl"
            >
              {editId ? "Update" : "Upload"}
            </button>

          </form>

          {/* LIST */}
          <div className="grid md:grid-cols-4 gap-4 mt-8">

            {investments.map((item) => (
              <div
                key={item.id}
                className="bg-zinc-950 border border-white/10 rounded-2xl overflow-hidden"
              >

                <div className="grid grid-cols-2 gap-1">
  {item.images?.map((img, i) => (
    <img
      key={i}
      src={img}
      className="w-full h-20 object-cover rounded"
    />
  ))}
</div>

                <div className="p-4">

                  <div className="flex justify-between mb-3">

                    <span className="text-yellow-400 text-sm">
                      {item.type}
                    </span>

                    <span className="text-gray-400 text-xs">
                      {item.stage}
                    </span>

                  </div>

                  <div className="flex gap-2">

                    <button
                      onClick={() => editInvestment(item)}
                      className="flex-1 bg-blue-600 py-2 rounded-lg text-sm"
                    >
                      Edit
                    </button>

                    <button
                      onClick={() => deleteInvestment(item.id)}
                      className="flex-1 bg-red-600 py-2 rounded-lg text-sm"
                    >
                      Delete
                    </button>

                  </div>

                </div>

              </div>
            ))}

          </div>

        </div>

        {/* ================= DONORS ================= */}
        <div className="bg-white/[0.03] border border-white/10 rounded-3xl p-6">

          <div className="mb-8">
            <h2 className="text-2xl font-bold">
              Donatorët
            </h2>

            <p className="text-gray-400 mt-2 text-sm">
              Menaxho donatorët
            </p>
          </div>

          <form
            onSubmit={handleDonor}
            className="grid md:grid-cols-4 gap-4"
          >

            <input
              type="text"
              placeholder="Emri"
              value={dName}
              onChange={(e) => setDName(e.target.value)}
              className="bg-zinc-900 border border-white/10 rounded-xl p-3"
            />

            <input
              type="number"
              placeholder="Shuma"
              value={dAmount}
              onChange={(e) => setDAmount(e.target.value)}
              className="bg-zinc-900 border border-white/10 rounded-xl p-3"
            />

            <input
              type="text"
              placeholder="Përshkrimi"
              value={dDescription}
              onChange={(e) => setDDescription(e.target.value)}
              className="bg-zinc-900 border border-white/10 rounded-xl p-3"
            />

            <button
              className="bg-green-600 hover:bg-green-500 transition rounded-xl font-semibold"
            >
              {dEditId ? "Update" : "Save"}
            </button>

          </form>

          <div className="grid md:grid-cols-3 gap-4 mt-8">

            {donors.map((item) => (
              <div
                key={item.id}
                className="bg-zinc-950 border border-white/10 rounded-2xl p-4"
              >

                <div className="flex justify-between items-start">

                  <div>
                    <h3 className="text-yellow-400 font-semibold">
                      {item.name}
                    </h3>

                    <p className="text-gray-400 text-sm mt-1">
                      {item.description}
                    </p>
                  </div>

                  <div className="text-green-400 font-bold">
                    {item.amount}€
                  </div>

                </div>

                <div className="flex gap-2 mt-4">

                  <button
                    onClick={() => editDonor(item)}
                    className="flex-1 bg-blue-600 py-2 rounded-lg text-sm"
                  >
                    Edit
                  </button>

                  <button
                    onClick={() => deleteDonor(item.id)}
                    className="flex-1 bg-red-600 py-2 rounded-lg text-sm"
                  >
                    Delete
                  </button>

                </div>

              </div>
            ))}

          </div>

        </div>

        {/* ================= REPORTS ================= */}
        <div className="bg-white/[0.03] border border-white/10 rounded-3xl p-6">

          <div className="mb-8">
            <h2 className="text-2xl font-bold">
              Raportet
            </h2>

            <p className="text-gray-400 mt-2 text-sm">
              Raport financiar i investimeve
            </p>
          </div>

          <form
            onSubmit={handleReport}
            className="grid md:grid-cols-5 gap-4"
          >

            <input
              type="text"
              placeholder="Investimi"
              value={rTitle}
              onChange={(e) => setRTitle(e.target.value)}
              className="bg-zinc-900 border border-white/10 rounded-xl p-3"
            />

            <input
              type="number"
              placeholder="Shuma"
              value={rAmount}
              onChange={(e) => setRAmount(e.target.value)}
              className="bg-zinc-900 border border-white/10 rounded-xl p-3"
            />

            <input
              type="date"
              value={rDate}
              onChange={(e) => setRDate(e.target.value)}
              className="bg-zinc-900 border border-white/10 rounded-xl p-3"
            />

            <input
              type="text"
              placeholder="Periudha / Viti"
              value={rPeriod}
              onChange={(e) => setRPeriod(e.target.value)}
              className="bg-zinc-900 border border-white/10 rounded-xl p-3"
            />

            <button
              className="bg-purple-600 hover:bg-purple-500 transition rounded-xl font-semibold"
            >
              {rEditId ? "Update" : "Save"}
            </button>

          </form>

          <div className="overflow-x-auto mt-8">

            <table className="w-full">

              <thead>
                <tr className="border-b border-white/10 text-gray-400 text-sm">
                  <th className="text-left p-3">Investimi</th>
                  <th className="text-left p-3">Shuma</th>
                  <th className="text-left p-3">Data</th>
                  <th className="text-left p-3">Periudha</th>
                  <th className="text-left p-3">Actions</th>
                </tr>
              </thead>

              <tbody>

                {reports.map((item) => (
                  <tr
                    key={item.id}
                    className="border-b border-white/5"
                  >

                    <td className="p-3">
                      {item.title}
                    </td>

                    <td className="p-3 text-green-400">
                      {item.amount}€
                    </td>

                    <td className="p-3 text-gray-400">
                      {item.date}
                    </td>

                    <td className="p-3 text-yellow-400">
                      {item.period}
                    </td>

                    <td className="p-3">

                      <div className="flex gap-2">

                        <button
                          onClick={() => editReport(item)}
                          className="bg-blue-600 px-3 py-1 rounded-lg text-sm"
                        >
                          Edit
                        </button>

                        <button
                          onClick={() => deleteReport(item.id)}
                          className="bg-red-600 px-3 py-1 rounded-lg text-sm"
                        >
                          Delete
                        </button>

                      </div>

                    </td>

                  </tr>
                ))}

              </tbody>

            </table>

          </div>

        </div>

      </div>

    </div>
  );
}

export default Admin;