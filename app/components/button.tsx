import {
  Button as HeadlessButton,
  type ButtonProps as HeadlessButtonProps,
} from "@headlessui/react";
import { clsx } from "clsx";
import Link from "next/link";
import React from "react";
const styles = {
  base: [
    // Base
    "relative isolate inline-flex items-center justify-center gap-x-2 rounded-full border text-base/6 font-semibold",

    // Sizing
    "px-[calc(theme(spacing[3.5])-1px)] py-[calc(theme(spacing[2.5])-1px)] sm:px-[calc(theme(spacing.3)-1px)] sm:py-[calc(theme(spacing[1.5])-1px)] sm:text-sm/6",

    // Focus
    "focus:outline-none data-[focus]:outline data-[focus]:outline-2 data-[focus]:outline-offset-2 data-[focus]:outline-blue-500",

    // Disabled
    "data-[disabled]:opacity-50",

    // Icon
    "[&>[data-slot=icon]]:-mx-0.5 [&>[data-slot=icon]]:my-0.5 [&>[data-slot=icon]]:size-5 [&>[data-slot=icon]]:shrink-0 [&>[data-slot=icon]]:text-[--btn-icon] [&>[data-slot=icon]]:sm:my-1 [&>[data-slot=icon]]:sm:size-4 forced-colors:[--btn-icon:ButtonText] forced-colors:data-[hover]:[--btn-icon:ButtonText]",
  ],
  solid: [
    // Simple solid background with border
    "border-transparent bg-[--btn-bg] shadow-sm",

    // Hover and active states
    "data-[hover]:bg-[--btn-hover] data-[active]:bg-[--btn-active]",

    // Dark mode adjustments
    "dark:shadow-none",
  ],
  outline: [
    // Base
    "border-zinc-950/10 text-zinc-950 data-[active]:bg-zinc-950/[2.5%] data-[hover]:bg-zinc-950/[2.5%]",

    // Dark mode
    "dark:border-white/15 dark:text-white dark:[--btn-bg:transparent] dark:data-[active]:bg-white/5 dark:data-[hover]:bg-white/5",

    // Icon
    "[--btn-icon:theme(colors.zinc.500)] data-[active]:[--btn-icon:theme(colors.zinc.700)] data-[hover]:[--btn-icon:theme(colors.zinc.700)] dark:data-[active]:[--btn-icon:theme(colors.zinc.400)] dark:data-[hover]:[--btn-icon:theme(colors.zinc.400)]",
  ],
  plain: [
    // Base
    "border-transparent text-zinc-950 data-[active]:bg-zinc-950/5 data-[hover]:bg-zinc-950/5",

    // Dark mode
    "dark:text-white dark:data-[active]:bg-white/10 dark:data-[hover]:bg-white/10",

    // Icon
    "[--btn-icon:theme(colors.zinc.500)] data-[active]:[--btn-icon:theme(colors.zinc.700)] data-[hover]:[--btn-icon:theme(colors.zinc.700)] dark:[--btn-icon:theme(colors.zinc.500)] dark:data-[active]:[--btn-icon:theme(colors.zinc.400)] dark:data-[hover]:[--btn-icon:theme(colors.zinc.400)]",
  ],
  colors: {
    "dark/zinc": [
      "text-white [--btn-bg:theme(colors.zinc.900)] [--btn-hover:theme(colors.zinc.800)] [--btn-active:theme(colors.zinc.700)]",
      "dark:text-white dark:[--btn-bg:theme(colors.zinc.600)] dark:[--btn-hover:theme(colors.zinc.500)] dark:[--btn-active:theme(colors.zinc.400)]",
      "[--btn-icon:theme(colors.zinc.400)] data-[active]:[--btn-icon:theme(colors.zinc.300)] data-[hover]:[--btn-icon:theme(colors.zinc.300)]",
    ],
    light: [
      "text-zinc-950 [--btn-bg:white] [--btn-hover:theme(colors.zinc.50)] [--btn-active:theme(colors.zinc.100)]",
      "dark:text-white dark:[--btn-bg:theme(colors.zinc.800)] dark:[--btn-hover:theme(colors.zinc.700)] dark:[--btn-active:theme(colors.zinc.600)]",
      "[--btn-icon:theme(colors.zinc.500)] data-[active]:[--btn-icon:theme(colors.zinc.700)] data-[hover]:[--btn-icon:theme(colors.zinc.700)] dark:[--btn-icon:theme(colors.zinc.500)] dark:data-[active]:[--btn-icon:theme(colors.zinc.400)] dark:data-[hover]:[--btn-icon:theme(colors.zinc.400)]",
    ],
    "dark/white": [
      "text-white [--btn-bg:theme(colors.zinc.900)] [--btn-hover:theme(colors.zinc.800)] [--btn-active:theme(colors.zinc.700)]",
      "dark:text-zinc-950 dark:[--btn-bg:white] dark:[--btn-hover:theme(colors.zinc.100)] dark:[--btn-active:theme(colors.zinc.200)]",
      "[--btn-icon:theme(colors.zinc.400)] data-[active]:[--btn-icon:theme(colors.zinc.300)] data-[hover]:[--btn-icon:theme(colors.zinc.300)] dark:[--btn-icon:theme(colors.zinc.500)] dark:data-[active]:[--btn-icon:theme(colors.zinc.400)] dark:data-[hover]:[--btn-icon:theme(colors.zinc.400)]",
    ],
    dark: [
      "text-white [--btn-bg:theme(colors.zinc.900)] [--btn-hover:theme(colors.zinc.800)] [--btn-active:theme(colors.zinc.700)]",
      "dark:[--btn-bg:theme(colors.zinc.800)] dark:[--btn-hover:theme(colors.zinc.700)] dark:[--btn-active:theme(colors.zinc.600)]",
      "[--btn-icon:theme(colors.zinc.400)] data-[active]:[--btn-icon:theme(colors.zinc.300)] data-[hover]:[--btn-icon:theme(colors.zinc.300)]",
    ],
    white: [
      "text-zinc-950 [--btn-bg:white] [--btn-hover:theme(colors.zinc.50)] [--btn-active:theme(colors.zinc.100)]",
      "dark:[--btn-bg:white] dark:[--btn-hover:theme(colors.zinc.100)] dark:[--btn-active:theme(colors.zinc.200)]",
      "[--btn-icon:theme(colors.zinc.400)] data-[active]:[--btn-icon:theme(colors.zinc.500)] data-[hover]:[--btn-icon:theme(colors.zinc.500)]",
    ],
    zinc: [
      "text-white [--btn-bg:theme(colors.zinc.600)] [--btn-hover:theme(colors.zinc.500)] [--btn-active:theme(colors.zinc.400)]",
      "dark:[--btn-bg:theme(colors.zinc.600)] dark:[--btn-hover:theme(colors.zinc.500)] dark:[--btn-active:theme(colors.zinc.400)]",
      "[--btn-icon:theme(colors.zinc.400)] data-[active]:[--btn-icon:theme(colors.zinc.300)] data-[hover]:[--btn-icon:theme(colors.zinc.300)]",
    ],
    indigo: [
      "text-white [--btn-bg:theme(colors.indigo.500)] [--btn-hover:theme(colors.indigo.400)] [--btn-active:theme(colors.indigo.300)]",
      "[--btn-icon:theme(colors.indigo.300)] data-[active]:[--btn-icon:theme(colors.indigo.200)] data-[hover]:[--btn-icon:theme(colors.indigo.200)]",
    ],
    cyan: [
      "text-cyan-950 [--btn-bg:theme(colors.cyan.300)] [--btn-hover:theme(colors.cyan.200)] [--btn-active:theme(colors.cyan.100)]",
      "[--btn-icon:theme(colors.cyan.500)]",
    ],
    red: [
      "text-white [--btn-bg:theme(colors.red.600)] [--btn-hover:theme(colors.red.500)] [--btn-active:theme(colors.red.400)]",
      "[--btn-icon:theme(colors.red.300)] data-[active]:[--btn-icon:theme(colors.red.200)] data-[hover]:[--btn-icon:theme(colors.red.200)]",
    ],
    orange: [
      "text-white [--btn-bg:theme(colors.orange.500)] [--btn-hover:theme(colors.orange.400)] [--btn-active:theme(colors.orange.300)]",
      "[--btn-icon:theme(colors.orange.300)] data-[active]:[--btn-icon:theme(colors.orange.200)] data-[hover]:[--btn-icon:theme(colors.orange.200)]",
    ],
    amber: [
      "text-amber-950 [--btn-bg:theme(colors.amber.400)] [--btn-hover:theme(colors.amber.300)] [--btn-active:theme(colors.amber.200)]",
      "[--btn-icon:theme(colors.amber.600)]",
    ],
    yellow: [
      "text-yellow-950 [--btn-bg:theme(colors.yellow.300)] [--btn-hover:theme(colors.yellow.200)] [--btn-active:theme(colors.yellow.100)]",
      "[--btn-icon:theme(colors.yellow.600)] data-[active]:[--btn-icon:theme(colors.yellow.700)] data-[hover]:[--btn-icon:theme(colors.yellow.700)]",
    ],
    lime: [
      "text-lime-950 [--btn-bg:theme(colors.lime.300)] [--btn-hover:theme(colors.lime.200)] [--btn-active:theme(colors.lime.100)]",
      "[--btn-icon:theme(colors.lime.600)] data-[active]:[--btn-icon:theme(colors.lime.700)] data-[hover]:[--btn-icon:theme(colors.lime.700)]",
    ],
    green: [
      "text-white [--btn-bg:theme(colors.green.600)] [--btn-hover:theme(colors.green.500)] [--btn-active:theme(colors.green.400)]",
      "[--btn-icon:theme(colors.white/60%)] data-[active]:[--btn-icon:theme(colors.white/80%)] data-[hover]:[--btn-icon:theme(colors.white/80%)]",
    ],
    emerald: [
      "text-white [--btn-bg:theme(colors.emerald.600)] [--btn-hover:theme(colors.emerald.500)] [--btn-active:theme(colors.emerald.400)]",
      "[--btn-icon:theme(colors.white/60%)] data-[active]:[--btn-icon:theme(colors.white/80%)] data-[hover]:[--btn-icon:theme(colors.white/80%)]",
    ],
    teal: [
      "text-white [--btn-bg:theme(colors.teal.600)] [--btn-hover:theme(colors.teal.500)] [--btn-active:theme(colors.teal.400)]",
      "[--btn-icon:theme(colors.white/60%)] data-[active]:[--btn-icon:theme(colors.white/80%)] data-[hover]:[--btn-icon:theme(colors.white/80%)]",
    ],
    sky: [
      "text-white [--btn-bg:theme(colors.sky.500)] [--btn-hover:theme(colors.sky.400)] [--btn-active:theme(colors.sky.300)]",
      "[--btn-icon:theme(colors.white/60%)] data-[active]:[--btn-icon:theme(colors.white/80%)] data-[hover]:[--btn-icon:theme(colors.white/80%)]",
    ],
    blue: [
      "text-white [--btn-bg:theme(colors.blue.600)] [--btn-hover:theme(colors.blue.500)] [--btn-active:theme(colors.blue.400)]",
      "[--btn-icon:theme(colors.blue.400)] data-[active]:[--btn-icon:theme(colors.blue.300)] data-[hover]:[--btn-icon:theme(colors.blue.300)]",
    ],
    violet: [
      "text-white [--btn-bg:theme(colors.violet.500)] [--btn-hover:theme(colors.violet.400)] [--btn-active:theme(colors.violet.300)]",
      "[--btn-icon:theme(colors.violet.300)] data-[active]:[--btn-icon:theme(colors.violet.200)] data-[hover]:[--btn-icon:theme(colors.violet.200)]",
    ],
    purple: [
      "text-white [--btn-bg:theme(colors.purple.500)] [--btn-hover:theme(colors.purple.400)] [--btn-active:theme(colors.purple.300)]",
      "[--btn-icon:theme(colors.purple.300)] data-[active]:[--btn-icon:theme(colors.purple.200)] data-[hover]:[--btn-icon:theme(colors.purple.200)]",
    ],
    fuchsia: [
      "text-white [--btn-bg:theme(colors.fuchsia.500)] [--btn-hover:theme(colors.fuchsia.400)] [--btn-active:theme(colors.fuchsia.300)]",
      "[--btn-icon:theme(colors.fuchsia.300)] data-[active]:[--btn-icon:theme(colors.fuchsia.200)] data-[hover]:[--btn-icon:theme(colors.fuchsia.200)]",
    ],
    pink: [
      "text-white [--btn-bg:theme(colors.pink.500)] [--btn-hover:theme(colors.pink.400)] [--btn-active:theme(colors.pink.300)]",
      "[--btn-icon:theme(colors.pink.300)] data-[active]:[--btn-icon:theme(colors.pink.200)] data-[hover]:[--btn-icon:theme(colors.pink.200)]",
    ],
    rose: [
      "text-white [--btn-bg:theme(colors.rose.500)] [--btn-hover:theme(colors.rose.400)] [--btn-active:theme(colors.rose.300)]",
      "[--btn-icon:theme(colors.rose.300)] data-[active]:[--btn-icon:theme(colors.rose.200)] data-[hover]:[--btn-icon:theme(colors.rose.200)]",
    ],
  },
};

type ButtonProps = (
  | { color?: keyof typeof styles.colors; outline?: never; plain?: never }
  | { color?: never; outline: true; plain?: never }
  | { color?: never; outline?: never; plain: true }
) & { children: React.ReactNode } & (
    | HeadlessButtonProps
    | React.ComponentPropsWithoutRef<typeof Link>
  );

export const Button = React.forwardRef(function Button(
  { color, outline, plain, className, children, ...props }: ButtonProps,
  ref: React.ForwardedRef<HTMLElement>
) {
  const classes = clsx(
    className,
    styles.base,
    outline
      ? styles.outline
      : plain
      ? styles.plain
      : clsx(styles.solid, styles.colors[color ?? "dark/zinc"])
  );

  return "href" in props ? (
    <Link
      {...props}
      className={classes}
      ref={ref as React.ForwardedRef<HTMLAnchorElement>}
    >
      <TouchTarget>{children}</TouchTarget>
    </Link>
  ) : (
    <HeadlessButton
      {...props}
      className={clsx(classes, "cursor-default")}
      ref={ref}
    >
      <TouchTarget>{children}</TouchTarget>
    </HeadlessButton>
  );
});

/* Expand the hit area to at least 44×44px on touch devices */
export function TouchTarget({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      <span
        className="absolute left-1/2 top-1/2 size-[max(100%,2.75rem)] -translate-x-1/2 -translate-y-1/2 [@media(pointer:fine)]:hidden"
        aria-hidden="true"
      />
    </>
  );
}
