import { getMail } from "@workspace/nest-api";

export async function POST(request: Request) {
    const payload = await request.json();

    const api = getMail()
    const response = await api.mailSendMail({
        email: payload.email,
        subject: payload.subject,
        body: payload.body,
    });

    return new Response(JSON.stringify(response));
}
