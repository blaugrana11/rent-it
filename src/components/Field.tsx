// src/components/Field.tsx
import { JSX } from "solid-js";
import { Dynamic } from "solid-js/web";

export type FieldProps = {
  name: string;
  label: string;
} & (
  | ({
      tag?: "input";
    } & JSX.InputHTMLAttributes<HTMLInputElement>)
  | ({
      tag: "textarea";
    } & JSX.TextareaHTMLAttributes<HTMLTextAreaElement>)
  | ({
      tag: "select";
    } & JSX.SelectHTMLAttributes<HTMLSelectElement>)
);

export const Field = (props: FieldProps) => (
  <div class="mb-4">
    <label
      for={props.name}
      class="block text-sm font-medium text-gray-700 mb-1"
    >
      {props.label}
    </label>
    <Dynamic
      component={props.tag ?? "input"}
      required
      class="w-full px-4 py-3 rounded-lg border border-gray-300 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 transition"
      {...props}
      children={props.children}
    />
  </div>
);
