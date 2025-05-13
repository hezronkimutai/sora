import { Metadata } from "next";

type GenerateMetadata = () => Promise<Metadata> | Metadata;

declare module "next" {
  interface PageProps {
    params?: { [key: string]: string };
    searchParams?: { [key: string]: string | string[] | undefined };
  }
}