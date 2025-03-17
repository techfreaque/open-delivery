/* eslint-disable no-console */
import "./env-setup";

import fs from "fs";
import mjml2html from "mjml";
import path from "path";

const mailDir = path.join("src/lib/email");

const buildDir = path.join(mailDir, "compiled-templates");

console.log(`Building email templates to ${buildDir}`);

function mergeMjmlFiles(): void {
  const templateDir = path.join(mailDir, "templates");
  const masterFile = path.join(templateDir, "mail-template.mjml");

  // 1) Read the master layout
  const masterLayout = fs.readFileSync(masterFile, "utf8");

  // 2) List of partial MJML files we want to merge
  const partialNames = ["support-mail", "reset-password-mail"];

  // 3) Ensure build directory exists
  if (!fs.existsSync(buildDir)) {
    fs.mkdirSync(buildDir, { recursive: true });
  }

  // 4) For each partial, inject it into the master and write out
  partialNames.forEach((partialBaseName) => {
    const partialPath = path.join(templateDir, `${partialBaseName}.mjml`);
    const partialContent = fs.readFileSync(partialPath, "utf8");

    // Perform the string replacement
    const mergedMjml = masterLayout.replace(
      "${additionalContent}",
      partialContent,
    );

    // Write the merged MJML to the build directory
    const outputFilePath = path.join(buildDir, `${partialBaseName}.mjml`);
    fs.writeFileSync(outputFilePath, mergedMjml, "utf8");
    console.log(`Built ${partialBaseName}.mjml -> ${outputFilePath}`);
  });
}

function compileMjmlFiles(): void {
  if (!fs.existsSync(buildDir)) {
    fs.mkdirSync(buildDir);
  }

  // read all the `.mjml` files in buildDir
  const files = fs.readdirSync(buildDir).filter((f) => f.endsWith(".mjml"));

  files.forEach((file) => {
    const mjmlPath = path.join(buildDir, file);
    const mjmlContent = fs.readFileSync(mjmlPath, "utf8");
    const { html } = mjml2html(mjmlContent);

    // e.g. "support-mail.mjml" -> "support-mail.html"
    const outFileName = file.replace(".mjml", ".html");
    const outPath = path.join(buildDir, outFileName);

    fs.writeFileSync(outPath, html, "utf8");
    console.log(`Compiled ${file} -> ${outFileName}`);
  });
}

mergeMjmlFiles();
compileMjmlFiles();
