import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { env } from "../../config/env.js";
import { ApiError } from "../../shared/errors.js";
import { authModel } from "./auth.model.js";
import { userSerializer } from "./auth.serializer.js";

export async function login(email: string, password: string) {
  const user = await authModel.findByEmail(email.toLowerCase());
  if (
    !user ||
    !user.active ||
    !(await bcrypt.compare(password, user.passwordHash))
  )
    throw new ApiError(401, "Invalid email or password");
  const token = jwt.sign({ role: user.role }, env.JWT_SECRET, {
    subject: user.id,
    expiresIn: env.JWT_EXPIRES_IN as jwt.SignOptions["expiresIn"],
  });
  return { token, user: userSerializer(user) };
}

export async function createUser(input: {
  name: string;
  email: string;
  password: string;
  role: "ADMIN" | "STAFF";
}) {
  const user = await authModel.createUser({
    name: input.name,
    email: input.email.toLowerCase(),
    passwordHash: await bcrypt.hash(input.password, 12),
    role: input.role,
  });
  return userSerializer(user);
}
