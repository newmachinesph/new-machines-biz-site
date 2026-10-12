import Image from "next/image";

export type ExampleBrandName = "aster-labs" | "meridian" | "kanso-studio" | "aster-supply";

/** Original identities for organisations inside the synthetic product examples. */
export function ExampleBrand({ name, className }: { name: ExampleBrandName; className?: string }) {
  return <Image className={className} src={`/brands/examples/${name}.svg`} width={40} height={40} alt="" aria-hidden="true" />;
}
