import { prisma } from "../db";
import { betterAuth, logger } from "better-auth";
import { i18n as betterAuthI18n } from "@better-auth/i18n";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { admin, username } from "better-auth/plugins"
import { APIError, createAuthMiddleware, getIp } from "better-auth/api";
import { sso } from "@better-auth/sso"
import { passkey } from "@better-auth/passkey"

export const auth = betterAuth({
  telemetry: {
    enabled: false
  },
  database: prismaAdapter(prisma, {
    provider: "postgresql"
  }),
  baseURL: process.env.APP_BASE as string,
  plugins: [
    username(),
    admin({
      adminRoles: ["admin"],
    }),
    sso({
      organizationProvisioning: {
        disabled: false,
        defaultRole: "member",
      }
    }),
    passkey(),
  ]
});