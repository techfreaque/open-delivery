import type { JSX } from "react";

import { Div } from "@/client-package/components/div";
import { DocumentHead } from "@/client-package/components/document-head";
import { H1 } from "@/client-package/components/heading";
import { Link } from "@/client-package/components/link";
import { Text } from "@/client-package/components/text";

export default function NotFoundScreen(): JSX.Element {
  return (
    <>
      <DocumentHead title="Oops!" />

      <Div className="flex flex-1 items-center justify-center p-5">
        <H1>This screen doesn't exist.</H1>
        <Link href="/">
          <Text>Go to home screen!</Text>
        </Link>
      </Div>
    </>
  );
}
