import { component$, type PropsOf } from "@builder.io/qwik";
import logoImg from "~/media/redimed-logo.webp";

export const LogoFull = component$<PropsOf<"img">>((props) => {
  return (
    <img
      src={logoImg}
      alt="Redimed"
      {...props}
    />
  );
});
