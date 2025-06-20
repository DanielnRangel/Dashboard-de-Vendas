import React, { useEffect, useState } from "react";
import { Bar, Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
  ArcElement,
} from "chart.js";
import axios from "axios";

ChartJS.register(
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
  ArcElement
);

export default function Dashboard() {
  const [metricas, setMetricas] = useState(null);
  const [loading, setLoading] = useState(true);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const fetchMetricas = () => {
    setLoading(true);
    const params = {};
    if (startDate) params.startDate = startDate;
    if (endDate) params.endDate = endDate;

    axios
      .get("http://localhost:5021/api/metricas", { params })
      .then((res) => {
        setMetricas(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Erro ao buscar métricas:", err);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchMetricas();
  }, []);

  const downloadJSON = () => {
    const params = new URLSearchParams();
    if (startDate) params.append("startDate", startDate);
    if (endDate) params.append("endDate", endDate);

    window.open(
      `http://localhost:5021/api/metricas/download/json?${params.toString()}`,
      "_blank"
    );
  };

  if (loading) return <div className="p-4">Carregando...</div>;
  if (!metricas) return <div className="p-4">Erro ao carregar dados</div>;

  const { vendasPorMes, vendasPorVendedor, produtoMaisVendido } = metricas;

  const barData = {
    labels: Object.keys(vendasPorMes),
    datasets: [
      {
        label: "Vendas por Mês",
        data: Object.values(vendasPorMes),
        backgroundColor: "#4f46e5",
      },
    ],
  };

  const pieData = {
    labels: Object.keys(vendasPorVendedor),
    datasets: [
      {
        label: "Vendas por Vendedor",
        data: Object.values(vendasPorVendedor),
        backgroundColor: [
          "#22c55e",
          "#facc15",
          "#ef4444",
          "#3b82f6",
          "#330099 ",
        ],
      },
    ],
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className=" text-5xl font-bold mb-4 text-blue-500">
        Dashboard de Vendas
      </h1>

      <div className="flex flex-col md:flex-row items-center gap-4 mb-6">
        <div className="flex flex-col">
          <label className="text-sm font-medium">Data inicial</label>
          <input
            type="date"
            className="input input-bordered"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
        </div>
        <div className="flex flex-col">
          <label className="text-sm font-medium">Data final</label>
          <input
            type="date"
            className="input input-bordered"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
          />
        </div>
        <button
          className="btn btn-secondary mt-2 md:mt-6"
          onClick={fetchMetricas}
        >
          Filtrar
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-4 rounded-2xl shadow">
          <h2 className="text-xl font-semibold mb-2 text-blue-800">
            Vendas por Mês
          </h2>
          <Bar data={barData} />
        </div>

        <div className="bg-white p-4 rounded-2xl shadow">
          <h2 className="text-xl font-semibold mb-2 text-blue-800">
            Vendas por Vendedor
          </h2>
          <Pie data={pieData} />
        </div>
      </div>

      <div className="mt-6">
        <p className="text-lg font-medium">
          Produto mais vendido:{" "}
          <span className="font-bold">{produtoMaisVendido}</span>
        </p>
        <button className="btn btn-outline mt-4" onClick={downloadJSON}>
          Baixar JSON
        </button>
      </div>
    </div>
  );
}
