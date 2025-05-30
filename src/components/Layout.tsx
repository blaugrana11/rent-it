import { JSXElement, Show } from "solid-js";
import Nav from "./Nav";
import { createAsync } from "@solidjs/router";
import { getUser } from "~/lib/auth/user";

export default function Layout(props: { children: JSXElement; protected?: boolean }) {
  const user = createAsync(() => getUser());
  return (
    <>
      <Nav />
      <Show when={props.protected && !user()} fallback={props.children}>
        <div class="min-h-screen flex items-start justify-center bg-white-50 py-10">
          <div class="w-full max-w-2xl">
            <h1 class="text-3xl font-semibold text-center text-[#600AFF] mb-8 mt-6">
              Please log in to access this page
            </h1>
          </div>
        </div>
      </Show>
    </>
  )
}