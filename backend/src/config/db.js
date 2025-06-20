import mongoose from "mongoose";

export const connectDB = async () => {
  try {
    await mongoose.connect(
      "mongodb+srv://danielnrangel:eFJG1SXtwQbrEbUP@cluster0.vldxyis.mongodb.net/notes?retryWrites=true&w=majority&appName=Cluster0"
    );
    console.log("Conectado ao MongoDB");
  } catch (error) {
    console.log("Erro ao conectar MongoDB", error);
    process.exit(1);
  }
};
