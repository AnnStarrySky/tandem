import { NextResponse } from "next/server";

import { createDevMockUser } from "@shared/api/auth";
import { AUTH_ENV } from "@shared/config/auth";
import { decryptText } from "@shared/lib";

import type { BackendAuthResponse, BackendLoginResponse } from "@shared/types";

type RegisterBody = {
  email?: string;
  password?: string;
  name?: string;
};

function mapBackendLoginResponseToAuthResponse(
  data: BackendLoginResponse,
  email: string,
): BackendAuthResponse {
  return {
    user: {
      id: String(data.Id),
      email,
      name: data.Name,
    },
    accessToken: data.JWTToken,
  };
}

export async function POST(req: Request): Promise<Response> {
  try {
    const body = (await req.json()) as RegisterBody;

    const email = body.email?.trim().toLowerCase() ?? "";
    const encryptedPassword = body.password ?? "";
    const name = body.name?.trim() || "CodeCat User";

    if (!email || !encryptedPassword) {
      return NextResponse.json(
        {
          success: false,
          message: "Email and password are required",
        },
        { status: 400 },
      );
    }

    const password = await decryptText(encryptedPassword);

    if (!password) {
      return NextResponse.json(
        {
          success: false,
          message: "Password is required",
        },
        { status: 400 },
      );
    }

    if (AUTH_ENV.useMock) {
      const user = await createDevMockUser({
        email,
        password,
        name,
      });

      const auth: BackendAuthResponse = {
        user: {
          id: String(user.id),
          email: user.email,
          name: user.name,
        },
        accessToken: "mock-access-token",
        refreshToken: "mock-refresh-token",
      };

      return NextResponse.json({
        success: true,
        auth,
      });
    }

    if (!AUTH_ENV.backendUrl) {
      return NextResponse.json(
        {
          success: false,
          message: "Internal server error",
        },
        { status: 500 },
      );
    }

    const url = new URL("/api/register", AUTH_ENV.backendUrl);

    const backendResult = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        email,
        password,
        name,
      }),
    });

    if (!backendResult.ok) {
      let message = backendResult.statusText;

      try {
        const data = (await backendResult.json()) as { message?: string };
        message = data.message ?? message;
      } catch {
        // empty
      }

      return NextResponse.json(
        {
          success: false,
          message,
        },
        { status: backendResult.status },
      );
    }

    const data = (await backendResult.json()) as BackendLoginResponse;
    const auth = mapBackendLoginResponseToAuthResponse(data, email);

    return NextResponse.json({
      success: true,
      auth,
    });
  } catch {
    return NextResponse.json(
      {
        success: false,
        message: "Internal server error",
      },
      { status: 500 },
    );
  }
}
