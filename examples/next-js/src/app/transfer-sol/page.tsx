"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SolanaQRCode } from "@/components/qr-code";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { siteConfig } from "@/config/site";
import { useEffect, useState } from "react";

export default function Pages() {
  const apiPath = "/api/actions/transfer-sol";
  const [apiEndpoint, setApiEndpoint] = useState<null | string>(null);
  const [dataAction, setDataAction] = useState<null | any>(null);

  useEffect(() => {
    setApiEndpoint(new URL(apiPath, window.location.href).toString());

    return () => {
      setApiEndpoint(new URL(apiPath, window.location.href).toString());
    };
  }, []);

  const callApiEndpoint = async () => {
    if (apiEndpoint === null) return;
    try {
      const response = await fetch(apiEndpoint, {
        method: "GET", // hoặc "POST", tùy thuộc vào API của bạn
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch API");
      }

      const data = await response.json();
      console.log("API Response:", data);

      setDataAction(data);

      // Trả về dữ liệu hoặc xử lý thêm
      return data;
    } catch (error) {
      console.error("Error calling API:", error);
    }
  };

  useEffect(() => {
    callApiEndpoint();
  }, [apiEndpoint]);

  // const { title, icon, description, links } = dataAction as any;

  const link = apiEndpoint
    ? `${`https://x.com/intent/tweet?text=${encodeURIComponent(
        "Check out this Solana Action!",
      )}&url=${encodeURIComponent(apiEndpoint)}`}`
    : "";

  return (
    <section
      id="action"
      className={
        "container space-y-12 bg-slate-50 py-8 dark:bg-transparent md:py-12 lg:py-24"
      }
    >
      <div className="mx-auto flex max-w-[58rem] flex-col items-center space-y-6 text-center">
        <h2 className="font-heading text-3xl leading-[1.1] sm:text-3xl md:text-6xl">
          Transfer Native SOL
        </h2>
        <p className="max-w-[85%] leading-normal text-muted-foreground sm:text-lg sm:leading-7">
          The following example demonstrates how to transfer native SOL to using
          an Action.
        </p>
      </div>

      <Link href={link} target="_blank">
        AAAA X.com
      </Link>

      <Card className="group-hover:border-primary size-[400px] rounded overflow-hidden text-center flex items-center justify-center w-min mx-auto">
        <SolanaQRCode
          url={apiPath || ""}
          color="white"
          background="black"
          size={400}
          className="rounded-lg overflow-clip min-w-[400px]"
        />
      </Card>

      {apiPath && (
        <div className="mx-auto text-center md:max-w-[58rem]">
          <p className="leading-normal text-muted-foreground sm:text-lg sm:leading-7">
            View the{" "}
            <Button variant={"link"} asChild>
              <Link
                href={`${siteConfig.links.github}/src/app${apiPath}/route.ts`}
                target="_blank"
              >
                source code for this sample Action
              </Link>
            </Button>{" "}
            on GitHub.
          </p>
        </div>
      )}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {dataAction?.links?.actions?.map((action: any, index: number) => (
          <div
            key={index}
            className="p-4 border rounded-lg hover:shadow-lg transition"
          >
            <h3 className="font-bold">{action.label}</h3>
            <p className="text-gray-500 text-sm mb-2">{action.type}</p>
            <a
              href={action.href}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              {action.href.includes("{amount}")
                ? "Dynamic Amount Link"
                : "Execute Action"}
            </a>
          </div>
        ))}
      </div>

      <Card className="group-hover:border-primary">
        <CardHeader>
          <CardTitle className="space-y-3">Action Endpoint</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <p className="text-muted-foreground">
            <Link
              href={apiEndpoint || ""}
              target="_blank"
              className="underline hover:text-primary"
            >
              {apiEndpoint}
            </Link>
          </p>
        </CardContent>
      </Card>
    </section>
  );
}
