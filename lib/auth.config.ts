import { PrismaAdapter } from '@next-auth/prisma-adapter'
import type { NextAuthConfig } from 'next-auth'
import Credentials from 'next-auth/providers/credentials'
import Google from 'next-auth/providers/google'
import GitHub from 'next-auth/providers/github'
import bcrypt from 'bcryptjs'
import { prisma } from './prisma'
import { z } from 'zod'

// ========== VALIDATION SCHEMAS ==========
const signInSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
})

// ========== NEXTAUTH CONFIG ==========
export const authConfig: NextAuthConfig = {
  adapter: PrismaAdapter(prisma),
  providers: [
    // ===== CREDENTIALS PROVIDER (Email + Password) =====
    Credentials({
      name: 'Credentials',
      credentials: {
        email: {
          label: 'Email',
          type: 'email',
          placeholder: 'you@example.com',
        },
        password: {
          label: 'Password',
          type: 'password',
        },
      },
      async authorize(credentials, req) {
        // Validate input
        const parsed = signInSchema.safeParse(credentials)
        if (!parsed.success) return null

        const { email, password } = parsed.data

        // Find user in database
        const user = await prisma.user.findUnique({
          where: { email },
        })

        if (!user || !user.password_hash) {
          throw new Error('Invalid email or password')
        }

        if (!user.is_active) {
          throw new Error('Account has been deactivated')
        }

        // Compare passwords
        const isPasswordValid = await bcrypt.compare(password, user.password_hash)
        if (!isPasswordValid) {
          throw new Error('Invalid email or password')
        }

        // Update last login
        await prisma.user.update({
          where: { id: user.id },
          data: { last_login: new Date() },
        })

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
          tenant_id: user.tenant_id,
        }
      },
    }),

    // ===== GOOGLE OAUTH =====
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID || '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
      allowDangerousEmailAccountLinking: true,
    }),

    // ===== GITHUB OAUTH =====
    GitHub({
      clientId: process.env.GITHUB_CLIENT_ID || '',
      clientSecret: process.env.GITHUB_CLIENT_SECRET || '',
      allowDangerousEmailAccountLinking: true,
    }),
  ],

  pages: {
    signIn: '/auth/login',
    error: '/auth/error',
  },

  callbacks: {
    // ===== JWT CALLBACK: Add custom claims to token =====
    async jwt({ token, user, account, profile, isNewUser }) {
      if (user) {
        token.id = user.id
        token.role = (user as any).role || 'CLIENT'
        token.tenant_id = (user as any).tenant_id
      }

      // On OAuth, create or update user with tenant
      if (account?.provider && isNewUser) {
        const updatedUser = await prisma.user.update({
          where: { id: user?.id },
          data: {
            name: profile?.name || user?.name,
            [`${account.provider}_id`]: account.providerAccountId,
            ...(account.provider === 'google' && {
              google_id: account.providerAccountId,
            }),
            ...(account.provider === 'github' && {
              github_id: account.providerAccountId,
            }),
          },
        })
        
        token.role = updatedUser.role
        token.tenant_id = updatedUser.tenant_id
      }

      return token
    },

    // ===== SESSION CALLBACK: Add custom info to session =====
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string
        session.user.role = token.role as string
        ;(session.user as any).tenant_id = token.tenant_id as string
      }
      return session
    },

    // ===== SIGN IN CALLBACK: Allow/deny signups =====
    async signIn({ user, account, profile }) {
      // Allow if user exists
      if (!profile && !account) return true

      // OAuth: Allow if email verified
      if (account?.provider) {
        // Optionally check email verification
        return true
      }

      return true
    },
  },

  events: {
    async signIn({ user }) {
      // Log sign-in for audit
      if (user?.id) {
        await prisma.auditLog.create({
          data: {
            user_id: user.id,
            action: 'sign_in',
            resource_type: 'User',
            ip_address: undefined, // Would need to pass from middleware
          },
        }).catch(() => {}) // Ignore logging errors
      }
    },
  },

  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },

  secret: process.env.NEXTAUTH_SECRET,
}
