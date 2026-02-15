import type { NextConfig } from "next";
import type { WebpackConfigContext } from "next/dist/server/config-shared";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin({
  requestConfig: "./src/locales/request.ts",
  experimental: {
    messages: {
      path: "./src/locales",
      locales: ["en"],
      format: "json",
      precompile: true,
    },
  },
});

class VeliteWebpackPlugin {
  static started = false;
  apply(compiler: {
    options: { mode: string };
    hooks: {
      beforeCompile: {
        tapPromise: (name: string, callback: () => Promise<void>) => void;
      };
    };
  }) {
    compiler.hooks.beforeCompile.tapPromise(
      "VeliteWebpackPlugin",
      async () => {
        if (VeliteWebpackPlugin.started) return;
        VeliteWebpackPlugin.started = true;
        const dev = compiler.options.mode === "development";
        const { build } = await import("velite");
        await build({ watch: dev, clean: !dev });
      },
    );
  }
}

const config: NextConfig = {
  webpack: (
    config: { plugins: unknown[] },
    _context: WebpackConfigContext,
  ) => {
    config.plugins.push(new VeliteWebpackPlugin());
    return config;
  },
};

export default withNextIntl(config);
