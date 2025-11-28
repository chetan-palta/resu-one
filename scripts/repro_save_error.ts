


const BASE_URL = "http://localhost:5000";
const EMAIL = "test_repro@example.com";
const PASSWORD = "password123";

async function main() {
    try {
        console.log("1. Logging in...");
        let res = await fetch(`${BASE_URL}/api/auth/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email: EMAIL, password: PASSWORD }),
        });

        if (res.status === 401 || res.status === 404) {
            res = await fetch(`${BASE_URL}/api/auth/register`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email: EMAIL, password: PASSWORD, name: "Repro User" }),
            });
        }

        if (!res.ok) throw new Error(`Auth failed: ${res.status} ${res.statusText}`);
        const authData = await res.json() as { accessToken: string };
        const token = authData.accessToken;
        console.log("   Logged in.");

        console.log("2. Creating resume with empty email...");
        const resumeData = {
            title: "Repro Resume",
            template: "classic",
            font: "sans",
            data: {
                personal: {
                    fullName: "Repro User",
                    email: "", // Empty email
                    phone: "+919876543210",
                    location: "Bangalore",
                    isFresher: false
                },
                education: [],
                experience: [],
                skills: [],
                projects: [],
                certifications: [],
                languages: []
            }
        };

        const createRes = await fetch(`${BASE_URL}/api/resumes`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify(resumeData),
        });

        if (!createRes.ok) {
            console.log(`Failed: ${createRes.status} ${createRes.statusText}`);
            const text = await createRes.text();
            console.log("Response:", text);
        } else {
            console.log("Success!");
            console.log(await createRes.json());
        }

    } catch (error) {
        console.error("Error:", error);
    }
}

main();
