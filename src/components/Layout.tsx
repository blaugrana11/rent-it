import { JSXElement } from "solid-js";
import Nav from "./Nav";

export default function Layout(props: { children: JSXElement }) {
  return (
    <>
      <Nav />
      {props.children}
    </>
  )
}