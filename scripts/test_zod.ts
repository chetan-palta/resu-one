
import { z } from "zod";

const schema = z.object({
    personal: z.object({
        fullName: z.string(),
        email: z.string().email(),
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
    console.log("Validation passed");
} catch (error) {
    console.log("Validation failed:");
    if (error instanceof z.ZodError) {
        console.log(JSON.stringify(error.errors, null, 2));
    } else {
        console.log(error);
    }
}
