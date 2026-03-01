import { type Page } from '@playwright/test';

export type TestUserRole = 'client' | 'entreprise' | 'association' | 'technician' | 'admin';

interface TestAccount {
  email: string;
  password: string;
}

const TEST_ACCOUNTS: Record<TestUserRole, TestAccount> = {
  client: {
    email: process.env.TEST_CLIENT_EMAIL || 'test-citoyen@circular-electronics.com',
    password: process.env.TEST_CLIENT_PASSWORD || 'TestCircular2024',
  },
  entreprise: {
    email: process.env.TEST_ENTREPRISE_EMAIL || 'test-entreprise@circular-electronics.com',
    password: process.env.TEST_ENTREPRISE_PASSWORD || 'TestCircular2024',
  },
  association: {
    email: process.env.TEST_ASSOCIATION_EMAIL || 'test-association@circular-electronics.com',
    password: process.env.TEST_ASSOCIATION_PASSWORD || 'TestCircular2024',
  },
  technician: {
    email: process.env.TEST_TECHNICIAN_EMAIL || 'test-technician@circular-electronics.com',
    password: process.env.TEST_TECHNICIAN_PASSWORD || 'TestCircular2024',
  },
  admin: {
    email: process.env.TEST_ADMIN_EMAIL || 'test-admin@circular-electronics.com',
    password: process.env.TEST_ADMIN_PASSWORD || 'TestCircular2024',
  },
};

/**
 * Logs in as a test user via the API and sets tokens + user in localStorage.
 * Returns true if login succeeded, false otherwise.
 */
export async function loginAs(page: Page, role: TestUserRole = 'client'): Promise<boolean> {
  const account = TEST_ACCOUNTS[role];
  try {
    const response = await page.request.post('/api/auth/login', {
      data: { email: account.email, password: account.password },
    });

    if (!response.ok()) {
      console.warn(`Login failed for ${role} (${account.email}) — status ${response.status()}`);
      return false;
    }

    const body = await response.json();
    if (!body.success || !body.data?.accessToken) {
      console.warn(`No accessToken in login response for ${role}`);
      return false;
    }

    const { accessToken, refreshToken, user } = body.data;

    // Must navigate to the site first so localStorage is accessible on the correct origin
    await page.goto('/', { waitUntil: 'domcontentloaded' });

    // Set all 3 localStorage keys that AuthService expects
    await page.evaluate(
      ({ accessToken, refreshToken, user }) => {
        localStorage.setItem('access_token', accessToken);
        localStorage.setItem('refresh_token', refreshToken);
        localStorage.setItem('user', JSON.stringify(user));
      },
      { accessToken, refreshToken, user },
    );

    return true;
  } catch (err) {
    console.warn(`Login request failed for ${role}: ${err}`);
    return false;
  }
}

/** Convenience alias for backward compatibility */
export async function loginAsTestUser(page: Page): Promise<boolean> {
  return loginAs(page, 'client');
}
