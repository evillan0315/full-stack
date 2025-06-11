import { Injectable } from '@nestjs/common';
import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkStringify from 'remark-stringify';
import remarkRehype from 'remark-rehype';
import rehypeStringify from 'rehype-stringify';
import { Root } from 'mdast';
import * as fs from 'fs/promises';
import * as path from 'path';

@Injectable()
export class MarkdownUtilService {
  private globalCssContent: string | null = null;

  /**
   * Converts Markdown content to a Markdown Abstract Syntax Tree (MDAST) in JSON format.
   * @param markdown The Markdown string.
   * @returns The MDAST Root object.
   */
  async markdownToJson(markdown: string): Promise<Root> {
    const processor = unified().use(remarkParse);
    const tree = processor.parse(markdown);
    return tree as Root;
  }

  /**
   * Converts a JSON MDAST (Abstract Syntax Tree) back to Markdown content.
   * @param ast The MDAST Root object.
   * @returns The Markdown string.
   */
  async jsonToMarkdown(ast: Root): Promise<string> {
    const processor = unified().use(remarkStringify);
    const markdown = processor.stringify(ast);
    return markdown;
  }

  /**
   * Converts Markdown content to HTML, embedding global CSS style.
   * @param markdown The Markdown string.
   * @returns The HTML string with embedded styles.
   */
  async markdownToHtml(markdown: string): Promise<string> {
    if (this.globalCssContent === null) {
      await this.loadGlobalCss();
    }

    const file = await unified()
      .use(remarkParse)
      .use(remarkRehype)
      .use(rehypeStringify)
      .process(markdown);

    return `<style>${this.globalCssContent || ''}</style><div class="markdown-body">${String(file)}</div>`;
  }

  /**
   * Loads a global CSS file to be injected into the HTML output.
   */
  private async loadGlobalCss(): Promise<void> {
    const cssPath = path.resolve(__dirname, '../../../assets/github-markdown-light.css');
    try {
      this.globalCssContent = await fs.readFile(cssPath, 'utf8');
    } catch (error) {
      console.warn(`Failed to load global CSS from ${cssPath}:`, error);
      this.globalCssContent = '';
    }
  }
}

