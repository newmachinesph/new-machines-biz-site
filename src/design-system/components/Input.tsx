"use client";

import { Input as BaseInput } from "@base-ui-components/react/input";
import { forwardRef, useId, type InputHTMLAttributes } from "react";
import { Field, controlClass, fieldDescribedBy } from "./Field";

export type InputProps = Omit<InputHTMLAttributes<HTMLInputElement>, "color"> & {
  label: string;
  hint?: string;
  error?: string;
  /** Applied to the wrapping Field, not the <input>. */
  className?: string;
};

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { label, hint, error, id: idProp, className, "aria-describedby": describedByProp, ...rest },
  ref,
) {
  const generated = useId();
  const id = idProp ?? generated;
  const describedBy = [describedByProp, fieldDescribedBy(id, hint, error)].filter(Boolean).join(" ") || undefined;
  return (
    <Field id={id} label={label} hint={hint} error={error} className={className}>
      <BaseInput
        ref={ref}
        className={controlClass}
        {...rest}
        id={id}
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy}
      />
    </Field>
  );
});
