import { createFileRoute } from "@tanstack/react-router";
import { ForsakenApp } from "@/forsaken/App";

export const Route = createFileRoute("/")({ component: ForsakenApp });
