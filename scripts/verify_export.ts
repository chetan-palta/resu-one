
import fs from "fs";
import path from "path";

const BASE_URL = "http://localhost:4000";
const EMAIL = "test_export@example.com";
const PASSWORD = "password123";

async function main() {
    try {
        console.log("1. Registering/Logging in...");
        let token = "";

        // Try login first
        let res = await fetch(`${BASE_URL}/api/auth/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email: EMAIL, password: PASSWORD }),
        });

        if (res.status === 401 || res.status === 404) {
            // Register if login fails
            res = await fetch(`${BASE_URL}/api/auth/register`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email: EMAIL, password: PASSWORD, name: "Test User" }),
            });
        }

        if (!res.ok) throw new Error(`Auth failed: ${res.status} ${res.statusText}`);
        const authData = await res.json() as { accessToken: string };
        token = authData.accessToken;
        console.log("   Logged in successfully.");

        console.log("2. Creating a resume...");
        const resumeData = {
            title: "Export Test Resume",
            template: "classic",
            font: "sans",
            data: {
                personal: {
                    fullName: "Export Tester",
                    email: "export@test.com",
                    phone: "+919876543210",
                    location: "Bangalore, India",
                    isFresher: false
                },
                education: [
                    {
                        institution: "Test University",
                        degree: "B.Tech",
                        field: "CS",
                        startDate: "2018",
                        endDate: "2022",
                        scoreType: "CGPA",
                        scoreValue: "8.5",
                        scoreScale: "10"
                    }
                ],
                experience: [],
                skills: [{ category: "Tech", items: ["JS", "React"] }],
                projects: [],
                certifications: [],
                languages: []
            }
        };

        // Create the resume and get its ID
        // Create the resume and extract its ID with proper typing
        const createRes = await fetch(`${BASE_URL}/api/resumes`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify(resumeData),
        });
        if (!createRes.ok) throw new Error(`Resume creation failed: ${createRes.status} ${await createRes.text()}`);
        const { id: resumeId } = await createRes.json() as { id: string };

        // Export PDF using the created resume ID
        const pdfRes = await fetch(`${BASE_URL}/api/resumes/${resumeId}/export`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify({ format: "pdf", template: "classic", font: "sans" }),
        });
        if (!pdfRes.ok) throw new Error(`PDF Export failed: ${pdfRes.status} ${await pdfRes.text()}`);
        const pdfBuffer = Buffer.from(await pdfRes.arrayBuffer());
        fs.writeFileSync("test_resume.pdf", pdfBuffer);
        console.log(`   PDF exported (${pdfBuffer.length} bytes) to test_resume.pdf`);

        // Export DOCX using the same resume ID
        const docxRes = await fetch(`${BASE_URL}/api/resumes/${resumeId}/export`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify({ format: "docx", template: "classic", font: "sans" }),
        });
        if (!docxRes.ok) throw new Error(`DOCX Export failed: ${docxRes.status} ${await docxRes.text()}`);
        const docxBuffer = Buffer.from(await docxRes.arrayBuffer());
        fs.writeFileSync("test_resume.docx", docxBuffer);
        console.log(`   DOCX exported (${docxBuffer.length} bytes) to test_resume.docx`);


        console.log("Verification Successful!");

    } catch (error) {
        console.error("Verification Failed:", error);
        process.exit(1);
    }
}

main();
