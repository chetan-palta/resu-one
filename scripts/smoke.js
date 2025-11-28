const base = 'http://localhost:4000';
const ts = Date.now();
const email = `smoke+${ts}@example.com`;

async function run() {
  console.log('Using email:', email);

  try {
    const reg = await fetch(`${base}/api/auth/register`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ name: 'Smoke User', email, password: 'password123' }),
    });
    const regJson = await reg.json();
    console.log('REGISTER STATUS', reg.status);
    console.log('REGISTER BODY', JSON.stringify(regJson, null, 2));
  } catch (e) {
    console.error('Register request failed', e);
  }

  let loginJson;
  try {
    const login = await fetch(`${base}/api/auth/login`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ email, password: 'password123' }),
    });
    loginJson = await login.json();
    console.log('LOGIN STATUS', login.status);
    console.log('LOGIN BODY', JSON.stringify(loginJson, null, 2));
  } catch (e) {
    console.error('Login request failed', e);
    return;
  }

  const token = loginJson?.accessToken;
  if (!token) {
    console.error('No access token returned; aborting smoke test');
    return;
  }

  let created;
  try {
    const payload = {
      title: 'Smoke Resume',
      data: {
        personal: {
          fullName: 'Smoke User',
          email,
          phone: '123-456-7890',
          location: 'Nowhere',
        },
        education: [],
        experience: [],
        projects: [],
        skills: [],
        certifications: [],
        languages: [],
      },
      template: 'classic',
    };

    const create = await fetch(`${base}/api/resumes`, {
      method: 'POST',
      headers: { 'content-type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify(payload),
    });
    created = await create.json();
    console.log('CREATE STATUS', create.status);
    console.log('CREATE BODY', JSON.stringify(created, null, 2));
  } catch (e) {
    console.error('Create resume failed', e);
  }

  try {
    const list = await fetch(`${base}/api/resumes`, { headers: { Authorization: `Bearer ${token}` } });
    const listJson = await list.json();
    console.log('LIST STATUS', list.status);
    console.log('LIST BODY', JSON.stringify(listJson, null, 2));
  } catch (e) {
    console.error('List resumes failed', e);
  }
}

run().catch((e) => { console.error('Smoke script error', e); process.exit(1); });
