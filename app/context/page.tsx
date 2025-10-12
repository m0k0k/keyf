import { Header } from "@/components/header";
import { BrandForm } from "@/components/brand-form";
import { Brands } from "@/components/brands";
import Link from "next/link";

export default function BrandsList() {
  return (
    <div className="font-corp mx-auto max-w-3xl pt-20">
      <Header />
      <Brands />
      <BrandForm />
    </div>
  );
}
