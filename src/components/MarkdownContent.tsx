"use client";

import { createContext, useContext } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import type { Components } from "react-markdown";

const ListContext = createContext<"ul" | "ol">("ul");

const components: Components = {
  h1: ({ children }) => (
    <h1 className="font-display text-5xl italic font-bold text-[#0f0c0a] leading-tight mt-10 mb-5">
      {children}
    </h1>
  ),
  h2: ({ children }) => (
    <h2 className="mt-14 mb-5">
      <div className="h-px w-10 bg-[#9e7040] mb-4" />
      <span className="font-display text-3xl italic font-bold text-[#0f0c0a] leading-snug block">
        {children}
      </span>
    </h2>
  ),
  h3: ({ children }) => (
    <h3 className="font-display text-2xl italic font-bold text-[#0f0c0a] mt-10 mb-4 leading-snug">
      {children}
    </h3>
  ),
  h4: ({ children }) => (
    <h4 className="font-sans text-base font-semibold uppercase tracking-[0.15em] text-[#9e7040] mt-8 mb-3">
      {children}
    </h4>
  ),
  p: ({ children }) => (
    <p className="text-[17px] leading-[1.85] text-stone-700 mb-7">
      {children}
    </p>
  ),
  blockquote: ({ children }) => (
    <blockquote className="my-9 border-l-[3px] border-[#9e7040] pl-7 py-1">
      <div className="font-display text-xl italic text-[#0f0c0a] leading-relaxed [&>p]:mb-2">
        {children}
      </div>
    </blockquote>
  ),
  ul: ({ children }) => (
    <ListContext.Provider value="ul">
      <ul className="my-6 space-y-3 pl-1">
        {children}
      </ul>
    </ListContext.Provider>
  ),
  ol: ({ children }) => (
    <ListContext.Provider value="ol">
      <ol className="my-6 space-y-3 pl-6 list-decimal marker:text-[#9e7040] marker:font-semibold">
        {children}
      </ol>
    </ListContext.Provider>
  ),
  li: ({ children }) => {
    const listType = useContext(ListContext);
    if (listType === "ol") {
      return (
        <li className="text-[17px] leading-[1.8] text-stone-700 pl-1">
          {children}
        </li>
      );
    }
    return (
      <li className="flex gap-3 text-[17px] leading-[1.8] text-stone-700">
        <span className="mt-[0.65em] h-[5px] w-[5px] shrink-0 rounded-full bg-[#9e7040]" />
        <span>{children}</span>
      </li>
    );
  },
  a: ({ href, children }) => (
    <a
      href={href}
      className="text-[#9e7040] underline underline-offset-2 decoration-[#9e7040]/40 hover:decoration-[#9e7040] transition-all"
      target={href?.startsWith("http") ? "_blank" : undefined}
      rel={href?.startsWith("http") ? "noopener noreferrer" : undefined}
    >
      {children}
    </a>
  ),
  strong: ({ children }) => (
    <strong className="font-semibold text-[#0f0c0a]">{children}</strong>
  ),
  em: ({ children }) => (
    <em className="font-display italic text-[1.05em]">{children}</em>
  ),
  hr: () => (
    <div className="my-12 flex items-center justify-center">
      <span className="font-display text-xl tracking-[0.6em] text-[#9e7040]/40">· · ·</span>
    </div>
  ),
  img: ({ src, alt }) => (
    <figure className="my-10">
      {src && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={src}
          alt={alt ?? ""}
          className="w-full rounded-sm"
        />
      )}
      {alt && (
        <figcaption className="mt-3 text-center text-xs tracking-[0.2em] text-stone-400 uppercase">
          {alt}
        </figcaption>
      )}
    </figure>
  ),
  code: ({ children, className }) => {
    const isBlock = className?.includes("language-");
    if (isBlock) {
      return (
        <code className="block overflow-x-auto text-sm text-stone-300 font-mono leading-relaxed">
          {children}
        </code>
      );
    }
    return (
      <code className="rounded bg-[#ede5d8] px-1.5 py-0.5 text-[0.875em] font-mono text-stone-700">
        {children}
      </code>
    );
  },
  pre: ({ children }) => (
    <pre className="my-7 overflow-x-auto rounded-sm bg-stone-950 p-6 text-sm text-stone-300 font-mono leading-relaxed">
      {children}
    </pre>
  ),
  table: ({ children }) => (
    <div className="my-8 overflow-x-auto">
      <table className="w-full text-sm text-stone-700 border-collapse">
        {children}
      </table>
    </div>
  ),
  thead: ({ children }) => (
    <thead className="border-b border-[#9e7040]">{children}</thead>
  ),
  th: ({ children }) => (
    <th className="py-3 pr-6 text-left text-[10px] font-semibold uppercase tracking-[0.35em] text-[#9e7040]">
      {children}
    </th>
  ),
  td: ({ children }) => (
    <td className="py-3 pr-6 border-b border-[#dbd3c5]">{children}</td>
  ),
};

interface MarkdownContentProps {
  content: string;
}

export function MarkdownContent({ content }: MarkdownContentProps) {
  return (
    <div className="max-w-[68ch]">
      <ReactMarkdown remarkPlugins={[remarkGfm]} components={components}>
        {content}
      </ReactMarkdown>
    </div>
  );
}
