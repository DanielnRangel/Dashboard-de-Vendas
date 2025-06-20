import Venda from "../models/venda.js";
import fs from "fs";
import path from "path";
import csv from "csv-parser";

export const importarCSV = (req, res) => {
  const filePath = path.resolve("src/uploads/vendas_ultimos_12_meses.csv");
  const vendas = [];

  fs.createReadStream(filePath)
    .pipe(csv())
    .on("data", (row) => {
      try {
        const data = new Date(row["Data"]);
        const mes = `${data.getFullYear()}-${String(
          data.getMonth() + 1
        ).padStart(2, "0")}`;
        const vendedor = row["Vendedor"];
        const produto = row["Produto"];
        const valor = parseFloat(row["Valor (R$)"].replace(",", "."));

        if (!isNaN(valor)) {
          vendas.push({ data, mes, vendedor, produto, valor });
        }
      } catch (error) {
        console.error("Erro ao processar linha:", error);
      }
    })
    .on("end", async () => {
      try {
        await Venda.deleteMany({});
        await Venda.insertMany(vendas);
        res.json({ message: "Importação concluída", total: vendas.length });
      } catch (error) {
        console.error("Erro ao salvar vendas:", error);
        res.status(500).json({ error: "Erro ao salvar vendas" });
      }
    });
};

export const calcularMetricas = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;

    let filtro = {};
    if (startDate && endDate) {
      filtro.data = {
        $gte: new Date(startDate),
        $lte: new Date(endDate),
      };
    }

    const vendas = await Venda.find(filtro);

    const vendasPorMes = {};
    const vendasPorVendedor = {};
    const produtosVendidos = {};

    vendas.forEach((venda) => {
      vendasPorMes[venda.mes] = (vendasPorMes[venda.mes] || 0) + venda.valor;
      vendasPorVendedor[venda.vendedor] =
        (vendasPorVendedor[venda.vendedor] || 0) + venda.valor;
      produtosVendidos[venda.produto] =
        (produtosVendidos[venda.produto] || 0) + 1;
    });

    const produtoMaisVendido =
      Object.entries(produtosVendidos).sort((a, b) => b[1] - a[1])[0]?.[0] ||
      "Nenhum dado";

    res.json({
      vendasPorMes,
      vendasPorVendedor,
      produtoMaisVendido,
    });
  } catch (error) {
    console.error("Erro ao calcular métricas:", error);
    res.status(500).json({ error: "Erro ao calcular métricas." });
  }
};

export const downloadJson = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    let filtro = {};

    if (startDate && endDate) {
      filtro.data = {
        $gte: new Date(startDate),
        $lte: new Date(endDate),
      };
    }

    const vendas = await Venda.find(filtro).lean();

    res.setHeader("Content-Disposition", "attachment; filename=vendas.json");
    res.setHeader("Content-Type", "application/json");

    res.send(JSON.stringify(vendas, null, 2));
  } catch (error) {
    console.error("Erro ao gerar JSON:", error);
    res.status(500).json({ error: "Erro ao gerar JSON." });
  }
};
