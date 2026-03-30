import { form, getRequestEvent } from '$app/server';
import { loginSchema } from '$lib/models/zod-schema/auth-schema.js';
import { tryCatch } from '$lib/helpers/try-catch';
import { invalid } from '@sveltejs/kit';
import { APIError } from 'better-auth/api';
import { getAuth } from '$lib/server/auth';
import { redirectWithNext } from '$lib/server/auth-utils';

export const loginRemoteFunction = form(loginSchema, async ({ email, password }, issue) => {
  const auth = getAuth();
  const { error, data } = await tryCatch(
    auth.api.signInEmail({
      body: {
        email: email,
        password: password,
        rememberMe: true
      }
    })
  );

  if (
    error instanceof APIError &&
    error.body?.code === auth.$ERROR_CODES.INVALID_EMAIL_OR_PASSWORD.code
  ) {
    invalid(issue.email(auth.$ERROR_CODES.INVALID_EMAIL_OR_PASSWORD.message));
  }

  if (data && data.user) {
    return redirectWithNext(getRequestEvent());
  }

  return {
    success: false,
    message: 'Unable to login. Please try again later.'
  };
});
