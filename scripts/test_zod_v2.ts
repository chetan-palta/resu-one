
import { z } from "zod";

// Replicating the schema change to verify logic
const schema = z.object({
    personal: z.object({
        fullName: z.string(),
        email: z.string().email().or(z.literal("")),
        phone: z.string(),
        location: z.string(),
    })
});

const data = {
    personal: {
        fullName: "",
        email: "",
        phone: "",
        location: "",
    }
};

try {
    schema.parse(data);
    console.log("Validation passed with empty email");
} catch (error) {
    console.log("Validation failed:");
    if (error instanceof z.ZodError) {
        console.log(JSON.stringify(error.errors, null, 2));
    } else {
        console.log(error);
    }
}
