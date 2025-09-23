import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../authOptions"; // adjust path if needed
import { cookies } from "next/headers";
import { jwtDecode } from "jwt-decode";
import authService from "@/lib/services/auth";
import { removeKeysFromObject } from "@/helper/function";
// import { storeCookiesOfObject } from "@/helper/function";




export async function GET() {
    const session = await getServerSession(authOptions);
    if (!session) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const cookieStore = await cookies();

    // var id = jwtDecode(session.id_token || "") as any;

    const headers = { "Authorization": `Bearer ${session.accessToken}` }
    const { data } = await authService.getProfile(headers);
    const permission = await authService.getPermissions(headers);


    // const { id, ...cleanUser } = currentUser;    
    const idkeys = Object.keys(removeKeysFromObject(data,["dateOfBirth",'gender','image','preferences','loyaltyPoints','phoneNumber','role']));

    idkeys.forEach(key => {
        (cookieStore).set(`${key}`, data[key] || "", {
            httpOnly: true,
            secure: true,
            sameSite: "lax",
            path: "/",
            maxAge: 60 * 60 * 24 * 7,
        });
    });


    //  (cookieStore).set(`accessToken`, session.accessToken || "", {
    //         httpOnly: true,
    //         secure: true,
    //         sameSite: "lax",
    //         path: "/",
    //         maxAge: 60 * 60 * 24 * 7,
    //     });

    //      (cookieStore).set(`refreshToken`, session.refreshToken || "", {
    //         httpOnly: true,
    //         secure: true,
    //         sameSite: "lax",
    //         path: "/",
    //         maxAge: 60 * 60 * 24 * 7,
    //     });

    // const sdata: any = session;
    // const keys = Object.keys(sdata);
    // keys.forEach(key => {
    //     (cookieStore).set(`${key}`, sdata[key] || "", {
    //         httpOnly: true,
    //         secure: true,
    //         sameSite: "lax",
    //         path: "/",
    //         maxAge: 60 * 60 * 24 * 7,
    //     });
    // });
    // console.log(session);
    return NextResponse.json({ message: "Session cookies set successfully" });
}
