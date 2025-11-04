import express from "express";
import helmet from "helmet";
import morgan from "morgan";
import cors from "cors";

import UserRoutes from "@/users/infrastructure/routes/User.routes";
import ConversationRoutes from "@/conversations/infrastructure/routes/Conversation.routes";
import MessageRoutes from "@/messages/infrastructure/routes/Message.routes";

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(cors());
app.use(helmet());
app.use(morgan("dev"));
app.use(express.json());

app.use("/api/v1", UserRoutes);
app.use("/api/v1", ConversationRoutes);
app.use("/api/v1", MessageRoutes);

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
