import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../authOptions"; // adjust path if needed
import { cookies } from "next/headers";
import { jwtDecode } from "jwt-decode";
import authService from "@/lib/services/auth";
// import { storeCookiesOfObject } from "@/helper/function";




export async function GET() {
    const session = await getServerSession(authOptions);

    if (!session) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const cookieStore = await cookies();

    var id = jwtDecode(session.id_token || "") as any;

    const headers = { "Authorization": `Bearer ${session.accessToken}` }


    const currentUser = await authService.getUserProfile(headers);

    const { _id, ...cleanUser } = currentUser.result;
    const idkeys = Object.keys(cleanUser);
    idkeys.forEach(key => {
        (cookieStore).set(`${key}`, cleanUser[key] || "", {
            httpOnly: true,
            secure: true,
            sameSite: "lax",
            path: "/",
            maxAge: 60 * 60 * 24 * 7,
        });
    });


    // Store all session tokens in cookies
    (await
        // Store all session tokens in cookies
        cookieStore).set("accessToken", session.accessToken || "", {
            httpOnly: true,
            secure: true,
            sameSite: "lax",
            path: "/",
            maxAge: 60 * 60 * 24 * 7, // 1 week
        });

    (await cookieStore).set("refreshToken", session.refreshToken || "", {
        httpOnly: true,
        secure: true,
        sameSite: "lax",
        path: "/",
        maxAge: 60 * 60 * 24 * 7,
    });

    (await cookieStore).set("id_token", session.id_token || "", {
        httpOnly: true,
        secure: true,
        sameSite: "lax",
        path: "/",
        maxAge: 60 * 60 * 24 * 7,
    });
    //   storeCookiesOfObject(id,id.exp);
    (await cookieStore).set("token_type", session.token_type || "", {
        httpOnly: true,
        secure: true,
        sameSite: "lax",
        path: "/",
        maxAge: 60 * 60 * 24 * 7,
    });

    return NextResponse.json({ message: "Session cookies set successfully" });
}
