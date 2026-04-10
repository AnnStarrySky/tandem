import bcrypt from "bcryptjs";

type DevMockUser = {
  id: number;
  email: string;
  passwordHash: string;
  name: string;
};

const users: DevMockUser[] = [];
let lastId = 0;

async function ensureSeeded() {
  if (users.length > 0) {
    return;
  }

  const passwordHash = await bcrypt.hash("123456", 12);

  users.push({
    id: 1,
    email: "demo@codecat.dev",
    passwordHash,
    name: "Demo User",
  });

  lastId = 1;
}

export async function findDevMockUserByEmail(email: string): Promise<DevMockUser | null> {
  await ensureSeeded();

  const normalized = email.trim().toLowerCase();
  return users.find((user) => user.email === normalized) ?? null;
}

export async function createDevMockUser(input: {
  email: string;
  password: string;
  name?: string;
}): Promise<DevMockUser> {
  await ensureSeeded();

  const email = input.email.trim().toLowerCase();

  const existing = users.find((user) => user.email === email);
  if (existing) {
    throw new Error("Пользователь с таким email уже существует");
  }

  const passwordHash = await bcrypt.hash(input.password, 12);

  const user: DevMockUser = {
    id: ++lastId,
    email,
    passwordHash,
    name: input.name?.trim() || "CodeCat User",
  };

  users.push(user);

  return user;
}

export async function validateDevMockCredentials(input: {
  email: string;
  password: string;
}): Promise<DevMockUser> {
  await ensureSeeded();

  const email = input.email.trim().toLowerCase();
  const user = users.find((item) => item.email === email);

  if (!user) {
    throw new Error("Неверный email или пароль");
  }

  const isValid = await bcrypt.compare(input.password, user.passwordHash);

  if (!isValid) {
    throw new Error("Неверный email или пароль");
  }

  return user;
}

export async function updateDevMockUserProfile(input: {
  currentEmail: string;
  nextEmail: string;
  nextName: string;
}): Promise<DevMockUser> {
  await ensureSeeded();

  const currentEmail = input.currentEmail.trim().toLowerCase();
  const nextEmail = input.nextEmail.trim().toLowerCase();
  const nextName = input.nextName.trim();

  const user = users.find((item) => item.email === currentEmail);

  if (!user) {
    throw new Error("Пользователь не найден");
  }

  const emailTaken = users.find((item) => item.email === nextEmail && item.id !== user.id);

  if (emailTaken) {
    throw new Error("Пользователь с таким email уже существует");
  }

  user.email = nextEmail;
  user.name = nextName;

  return user;
}

export async function updateDevMockUserPassword(input: {
  email: string;
  currentPassword: string;
  nextPassword: string;
}): Promise<void> {
  await ensureSeeded();

  const email = input.email.trim().toLowerCase();
  const user = users.find((item) => item.email === email);

  if (!user) {
    throw new Error("Пользователь не найден");
  }

  const isValid = await bcrypt.compare(input.currentPassword, user.passwordHash);

  if (!isValid) {
    throw new Error("Текущий пароль введён неверно");
  }

  user.passwordHash = await bcrypt.hash(input.nextPassword, 12);
}
