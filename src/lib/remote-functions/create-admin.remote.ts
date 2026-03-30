import { form } from '$app/server';
import { getDiceBearURL } from '$lib/helpers/dice-bear';
import { tryCatch } from '$lib/helpers/try-catch.js';
import { registerSchema } from '$lib/models/zod-schema/auth-schema.js';
import { getAuth } from '$lib/server/auth.js';
import { getDb } from '$lib/server/db';
import { user } from '$lib/models/db-schema/auth.schema';
import { APIError } from 'better-auth/api';
import { DrizzleQueryError } from 'drizzle-orm';
import { eq } from 'drizzle-orm/sql';

export const createAdminRemoteFunction = form(registerSchema, async ({ name, email, password }) => {
	const db = getDb();
	const adminUser = await db.query.user.findFirst({
		where: eq(user.role, 'admin')
	});
	if (adminUser) {
		return {
			success: false,
			message: 'Admin already exists.'
		};
	}
	const auth = getAuth();
	const authCtx = await auth.$context;
	const internalAdapter = authCtx.internalAdapter;
	const { error, data } = await tryCatch(
		internalAdapter.createUser({
			email,
			name,
			password,
			image: getDiceBearURL({ seed: email }),
			role: 'admin',
			createdAt: new Date(),
			updatedAt: new Date()
		})
	);

	if (error instanceof APIError) {
		return {
			success: false,
			message: error.body?.message as string
		};
	}

	if (error instanceof DrizzleQueryError) {
		return {
			success: false,
			message: 'Issue with creating admin, connect with the creator'
		};
	}

	if (!data) {
		return {
			success: false,
			message: 'Unable to create admin.'
		};
	}

	const { error: linkAccountError, data: linkAccountData } = await tryCatch(
		internalAdapter.linkAccount({
			providerId: 'credential',
			accountId: data.id,
			userId: data.id,
			password: await authCtx.password.hash(password)
		})
	);

	if (linkAccountError instanceof APIError) {
		return {
			success: false,
			message: linkAccountError.body?.message as string
		};
	}

	if (linkAccountError instanceof DrizzleQueryError) {
		return {
			success: false,
			message: 'Issue with linking admin account, connect with the creator'
		};
	}

	if (linkAccountData) {
		return {
			success: true,
			message: 'Successfully created admin user and connected to account'
		};
	}

	return {
		success: false,
		message: 'Unable to create admin.'
	};
});
