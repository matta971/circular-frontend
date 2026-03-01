import { type Page } from '@playwright/test';

const TEST_EMAIL = process.env.TEST_EMAIL || 'test@circular-electronics.com';
const TEST_PASSWORD = process.env.TEST_PASSWORD || 'TestPassword123!';

export async function loginAsTestUser(page: Page): Promise<boolean> {
  try {
    const response = await page.request.post('/api/auth/login', {
      data: { email: TEST_EMAIL, password: TEST_PASSWORD },
    });

    if (!response.ok()) {
      console.warn(`Login failed with status ${response.status()} — auth tests will be skipped`);
      return false;
    }

    const body = await response.json();
    const token = body.data?.token || body.token;

    if (!token) {
      console.warn('No token in login response — auth tests will be skipped');
      return false;
    }

    await page.evaluate((t) => localStorage.setItem('token', t), token);
    return true;
  } catch {
    console.warn('Login request failed — auth tests will be skipped');
    return false;
  }
}

export function skipIfNoAuth(loggedIn: boolean) {
  if (!loggedIn) {
    throw new Error('Skipping: no test account available');
  }
}
