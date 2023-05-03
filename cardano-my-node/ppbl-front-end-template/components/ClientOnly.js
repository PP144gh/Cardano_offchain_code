import { useEffect, useState } from "react";

// Thank you to Josh Comeau
// Read more: https://blog.logrocket.com/why-use-next-js-apollo/

export default function ClientOnly({ children, ...delegated }) {
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  if (!hasMounted) {
    return null;
  }

  return <div {...delegated}>{children}</div>;
}