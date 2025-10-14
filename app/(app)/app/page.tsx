import { Header } from "@/components/header";
import { BrandForm } from "@/components/brand-form";
import { Brands } from "@/components/brands";

export default function BrandsList() {
  return (
    <>
      <div className="mx-auto max-w-3xl">
        <Header />
        <Brands />
        <BrandForm />
      </div>
    </>
  );
}
