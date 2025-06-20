import mongoose from "mongoose";

const vendaSchema = new mongoose.Schema({
  data: {
    type: Date,
    required: true,
  },
  mes: {
    type: String,
    required: true,
  },
  vendedor: {
    type: String,
    required: true,
  },
  produto: {
    type: String,
    required: true,
  },
  valor: {
    type: Number,
    required: true,
  },
});

const Venda = mongoose.model("Venda", vendaSchema);

export default Venda;
