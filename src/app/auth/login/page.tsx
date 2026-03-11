import React, { Suspense } from "react";

import { LoginPageClient } from "./page-client";

export default function LoginPage(): React.JSX.Element {
  return (
    <Suspense fallback={null}>
      <LoginPageClient />
    </Suspense>
  );
}
