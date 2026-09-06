import "dotenv/config";
import cors from "cors";
import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import multer from "multer";
import Database from "better-sqlite3";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { mkdir, readFile } from "node:fs/promises";

const app = express();
const port = Number(process.env.PORT || 3000);
const jwtSecret = process.env.JWT_SECRET || "development-secret-change-me";
const serverDirectory = path.dirname(fileURLToPath(import.meta.url));
const uploadsDirectory = path.join(serverDirectory, "uploads");
const databasePath = process.env.DB_PATH || path.join(serverDirectory, "..", "database", "servico-estudante.sqlite");

await mkdir(uploadsDirectory, { recursive: true });
await mkdir(path.dirname(databasePath), { recursive: true });

const database = new Database(databasePath);
database.pragma("foreign_keys = ON");
database.exec(await readFile(path.join(serverDirectory, "..", "database", "schema.sql"), "utf8"));

const upload = multer({
  dest: uploadsDirectory,
  limits: { fileSize: 50 * 1024 * 1024 }
});

app.use(cors({ origin: process.env.FRONTEND_URL || "http://localhost:9001" }));
app.use(express.json());
app.use("/uploads", express.static(uploadsDirectory));

function criarToken(userId) {
  return jwt.sign({ userId }, jwtSecret, { expiresIn: "7d" });
}

async function autenticar(req, res, next) {
  const authorization = req.headers.authorization;
  const token = authorization?.startsWith("Bearer ") ? authorization.slice(7) : null;
  if (!token) return res.status(401).json({ error: "Token não fornecido" });

  try {
    req.userId = jwt.verify(token, jwtSecret).userId;
    next();
  } catch {
    res.status(401).json({ error: "Token inválido ou expirado" });
  }
}

app.get("/api/health", (_req, res) => {
  try {
    database.prepare("SELECT 1").get();
    res.json({ ok: true, database: "connected", engine: "sqlite" });
  } catch (error) {
    res.status(503).json({ ok: false, database: "unavailable", error: error.message });
  }
});

app.post("/api/auth/register", async (req, res) => {
  const { email, password, nome } = req.body;
  if (!email || !password || !nome || password.length < 6) {
    return res.status(400).json({ error: "Nome, email e password com pelo menos 6 caracteres são obrigatórios" });
  }

  try {
    const passwordHash = await bcrypt.hash(password, 12);
    const result = database.prepare(
      "INSERT INTO users (email, password_hash, nome) VALUES (?, ?, ?)"
    ).run(email, passwordHash, nome);
    const userId = result.lastInsertRowid;
    res.status(201).json({ token: criarToken(userId), user: { id: userId, email, nome } });
  } catch (error) {
    const status = error.code === "SQLITE_CONSTRAINT_UNIQUE" ? 409 : 500;
    res.status(status).json({ error: status === 409 ? "Este email já está registado" : "Erro ao criar conta" });
  }
});

app.post("/api/auth/login", async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ error: "Email e password são obrigatórios" });

  try {
    const user = database.prepare(
      "SELECT id, email, password_hash, nome FROM users WHERE email = ?"
    ).get(email);
    if (!user || !(await bcrypt.compare(password, user.password_hash))) {
      return res.status(401).json({ error: "Credenciais inválidas" });
    }
    res.json({ token: criarToken(user.id), user: { id: user.id, email: user.email, nome: user.nome } });
  } catch {
    res.status(500).json({ error: "Erro ao iniciar sessão" });
  }
});

app.get("/api/profile", autenticar, (req, res) => {
  const user = database.prepare(
    "SELECT id, email, nome, bio, foto_url FROM users WHERE id = ?"
  ).get(req.userId);
  if (!user) return res.status(404).json({ error: "Utilizador não encontrado" });
  res.json(user);
});

app.get("/api/messages/:matchId", autenticar, (req, res) => {
  const rows = database.prepare(
    "SELECT id, match_id, sender_id, type, content, file_name, mime_type, created_at FROM messages WHERE match_id = ? ORDER BY created_at ASC",
  ).all(req.params.matchId);
  res.json(rows);
});

app.post("/api/messages/:matchId", autenticar, (req, res) => {
  const { type = "texto", content, fileName, mimeType } = req.body;
  if (!content) return res.status(400).json({ error: "O conteúdo é obrigatório" });
  const result = database.prepare(
    "INSERT INTO messages (match_id, sender_id, type, content, file_name, mime_type) VALUES (?, ?, ?, ?, ?, ?)"
  ).run(req.params.matchId, req.userId, type, content, fileName || null, mimeType || null);
  res.status(201).json({ id: result.lastInsertRowid, matchId: req.params.matchId, senderId: req.userId, type, content, fileName, mimeType });
});

app.post("/api/uploads", autenticar, upload.single("file"), (req, res) => {
  if (!req.file) return res.status(400).json({ error: "Nenhum ficheiro enviado" });
  res.status(201).json({
    url: `${req.protocol}://${req.get("host")}/uploads/${req.file.filename}`,
    fileName: req.file.originalname,
    mimeType: req.file.mimetype,
    size: req.file.size
  });
});

app.listen(port, () => {
  console.log(`API SkillSwap disponível em http://localhost:${port}`);
});
