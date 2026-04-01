import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

type StoredMockUser = {
  id: number;
  email: string;
  password: string;
  name: string;
};

type MockUsersDb = {
  users: StoredMockUser[];
  lastId: number;
};

const DATA_DIR = path.join(process.cwd(), ".mock-data");
const DB_PATH = path.join(DATA_DIR, "mock-users.json");

const DEFAULT_DB: MockUsersDb = {
  users: [
    {
      id: 1,
      email: "demo@codecat.dev",
      password: "123456",
      name: "Demo User",
    },
  ],
  lastId: 1,
};

async function ensureDbFile() {
  await mkdir(DATA_DIR, { recursive: true });

  try {
    await readFile(DB_PATH, "utf-8");
  } catch {
    await writeFile(DB_PATH, JSON.stringify(DEFAULT_DB, null, 2), "utf-8");
  }
}

async function readDb(): Promise<MockUsersDb> {
  await ensureDbFile();

  const raw = await readFile(DB_PATH, "utf-8");
  return JSON.parse(raw) as MockUsersDb;
}

async function writeDb(db: MockUsersDb): Promise<void> {
  await ensureDbFile();
  await writeFile(DB_PATH, JSON.stringify(db, null, 2), "utf-8");
}

export async function findMockUserByEmail(email: string): Promise<StoredMockUser | null> {
  const db = await readDb();
  const normalizedEmail = email.trim().toLowerCase();

  return db.users.find((user) => user.email === normalizedEmail) ?? null;
}

export async function createMockUser(input: {
  email: string;
  password: string;
  name?: string;
}): Promise<StoredMockUser> {
  const db = await readDb();

  const email = input.email.trim().toLowerCase();
  const password = input.password;
  const name = input.name?.trim() || "CodeCat User";

  const exists = db.users.some((user) => user.email === email);

  if (exists) {
    throw new Error("Пользователь с таким email уже существует");
  }

  const nextUser: StoredMockUser = {
    id: db.lastId + 1,
    email,
    password,
    name,
  };

  db.users.push(nextUser);
  db.lastId = nextUser.id;

  await writeDb(db);

  return nextUser;
}

export async function validateMockUserCredentials(input: {
  email: string;
  password: string;
}): Promise<StoredMockUser> {
  const email = input.email.trim().toLowerCase();
  const password = input.password;

  const user = await findMockUserByEmail(email);

  if (!user || user.password !== password) {
    throw new Error("Неверный email или пароль");
  }

  return user;
}

export async function updateMockUserProfile(input: {
  currentEmail: string;
  nextEmail: string;
  nextName: string;
}): Promise<StoredMockUser> {
  const db = await readDb();

  const currentEmail = input.currentEmail.trim().toLowerCase();
  const nextEmail = input.nextEmail.trim().toLowerCase();
  const nextName = input.nextName.trim() || "CodeCat User";

  const userIndex = db.users.findIndex((user) => user.email === currentEmail);

  if (userIndex === -1) {
    throw new Error("Пользователь не найден");
  }

  const emailTaken =
    nextEmail !== currentEmail && db.users.some((user) => user.email === nextEmail);

  if (emailTaken) {
    throw new Error("Пользователь с таким email уже существует");
  }

  db.users[userIndex] = {
    ...db.users[userIndex],
    email: nextEmail,
    name: nextName,
  };

  await writeDb(db);

  return db.users[userIndex];
}

export async function updateMockUserPassword(input: {
  email: string;
  currentPassword: string;
  nextPassword: string;
}): Promise<void> {
  const db = await readDb();

  const email = input.email.trim().toLowerCase();
  const currentPassword = input.currentPassword;
  const nextPassword = input.nextPassword;

  const userIndex = db.users.findIndex((user) => user.email === email);

  if (userIndex === -1) {
    throw new Error("Пользователь не найден");
  }

  if (db.users[userIndex].password !== currentPassword) {
    throw new Error("Текущий пароль введён неверно");
  }

  db.users[userIndex] = {
    ...db.users[userIndex],
    password: nextPassword,
  };

  await writeDb(db);
}
