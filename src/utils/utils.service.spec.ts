// src/utils/utils.service.ts
import {
  Injectable,
  InternalServerErrorException,
  HttpException,
  HttpStatus,
  Logger,
  BadRequestException, // Import BadRequestException
} from '@nestjs/common';
import * as sharp from 'sharp';
import * as potrace from 'potrace';
import * as fs from 'fs';
import * as path from 'path';
import { lookup as mimeLookup } from 'mime-types';
import * as dotenv from 'dotenv';
import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkRehype from 'remark-rehype';
import rehypeStringify from 'rehype-stringify';
import remarkStringify from 'remark-stringify';
import { Root } from 'mdast';
import * as prettier from 'prettier';

@Injectable()
export class UtilsService {
  private readonly logger = new Logger(UtilsService.name);
  private outputDir = path.join(__dirname, '../../svg-outputs');
  private globalCssContent: string | null = null; // To store the CSS content

  // --- Language Detection Maps ---
  private readonly EXTENSION_LANGUAGE_MAP: Record<string, string> = {
    js: 'javascript',
    jsx: 'javascript',
    ts: 'typescript',
    tsx: 'typescript',
    json: 'json',
    html: 'html',
    ejs: 'ejs',
    hbs: 'handlebars',
    css: 'css',
    scss: 'scss',
    less: 'less',
    md: 'markdown',
    py: 'python',
    java: 'java',
    cpp: 'cpp',
    cs: 'csharp',
    rs: 'rust',
    sh: 'shell',
    yml: 'yaml',
    yaml: 'yaml',
    xml: 'xml',
    txt: 'plaintext',
    go: 'go',
    php: 'php',
    vue: 'vue',
    svelte: 'svelte',
    sql: 'sql',
  };

  private readonly MIME_LANGUAGE_MAP: Record<string, string> = {
    'application/json': 'json',
    'text/html': 'html',
    'text/css': 'css',
    'text/javascript': 'javascript',
    'application/javascript': 'javascript',
    'application/x-typescript': 'typescript',
    'text/typescript': 'typescript',
    'text/markdown': 'markdown',
    'application/xml': 'xml',
    'text/x-python': 'python',
    'text/plain': 'plaintext',
    'application/x-sh': 'shell',
    'application/x-yaml': 'yaml',
    'video/mp2t': 'typescript', // This mapping seems unusual, verify if intended.
  };

  // --- Prettier Parser Map ---
  private readonly parserMap: Record<
    string,
    prettier.BuiltInParserName | string
  > = {
    javascript: 'babel',
    typescript: 'typescript',
    json: 'json',
    html: 'html',
    ejs: 'html',
    handlebars: 'html',
    css: 'css',
    scss: 'scss',
    less: 'less',
    markdown: 'markdown',
    yaml: 'yaml',
    xml: 'xml',
  };

  constructor() {
    this.initializeDirectories();
    this.loadGlobalCss();
  }

  private async initializeDirectories(): Promise<void> {
    try {
      await fs.promises.mkdir(this.outputDir, { recursive: true });
    } catch (error) {
      this.logger.error(
        `Failed to create output directory: ${this.outputDir}`,
        error.stack,
      );
      throw new InternalServerErrorException(
        'Failed to initialize file system utilities.',
      );
    }
  }

  private async loadGlobalCss(): Promise<void> {
    const cssFilePath = path.join(__dirname, '../../styles/global.css');
    try {
      this.globalCssContent = await fs.promises.readFile(cssFilePath, 'utf-8');
      this.logger.log('global.css loaded successfully.');
    } catch (error) {
      this.logger.error(
        `Failed to load global.css from ${cssFilePath}: ${error.message}`,
        error.stack,
      );
      this.globalCssContent = ''; // Default to empty string if loading fails
    }
  }

  private getTempPngPath(originalPath: string): string {
    const fileName = path.basename(originalPath, path.extname(originalPath));
    return path.join(this.outputDir, `${fileName}-${Date.now()}-temp.png`);
  }

  // Language Detection

  /**
   * Detects the programming language based on filename extension or MIME type.
   * Prioritizes extension over MIME type.
   * @param filename The name of the file (e.g., 'index.ts', 'document.txt').
   * @param mimeType Optional MIME type of the file (e.g., 'application/javascript').
   * @returns The detected language string (e.g., 'typescript', 'json'), or undefined if not detected.
   */
  detectLanguage(filename: string, mimeType?: string): string | undefined {
    if (!filename) {
      return undefined;
    }

    const ext = path.extname(filename).toLowerCase().substring(1);
    if (ext && this.EXTENSION_LANGUAGE_MAP[ext]) {
      return this.EXTENSION_LANGUAGE_MAP[ext];
    }

    const detectedMime = mimeType || mimeLookup(filename);
    if (detectedMime) {
      // Check if detectedMime is not falsy
      const normalizedMime = detectedMime.split(';')[0].toLowerCase();
      if (this.MIME_LANGUAGE_MAP[normalizedMime]) {
        // Check if the normalized MIME exists in the map
        return this.MIME_LANGUAGE_MAP[normalizedMime];
      }
    }

    return undefined;
  }

  // Code Formatting

  /**
   * Formats code using Prettier based on the detected language.
   * @param code The code string to format.
   * @param language The language of the code (e.g., 'typescript', 'json').
   * @returns The formatted code string, or the original code if formatting fails or no formatter is available.
   */
  async formatCode(code: string, language: string): Promise<string> {
    const parser = this.parserMap[language];
    if (!parser) {
      this.logger.warn(
        `No Prettier parser configured for language: ${language}`,
      );
      return code;
    }

    try {
      return await prettier.format(code, {
        parser: parser as prettier.BuiltInParserName,
        plugins: await this.loadPrettierPlugins(parser),
        singleQuote: true,
        trailingComma: 'all',
        semi: true,
        printWidth: 100,
      });
    } catch (error) {
      this.logger.error(
        `Failed to format code for language "${language}" using parser "${parser}": ${error.message}`,
        error.stack,
      );
      return code;
    }
  }

  private async loadPrettierPlugins(parser: string) {
    const externalPlugins: Record<string, string[]> = {
      yaml: ['prettier-plugin-yaml'],
      xml: ['@prettier/plugin-xml'],
    };

    const requiredPlugins = externalPlugins[parser];
    if (!requiredPlugins || requiredPlugins.length === 0) {
      return [];
    }

    try {
      const importedPlugins = await Promise.allSettled(
        requiredPlugins.map((p) => import(p)),
      );

      return importedPlugins
        .filter((result) => result.status === 'fulfilled')
        .map(
          (result: PromiseFulfilledResult<any>) =>
            result.value.default || result.value,
        );
    } catch (error) {
      this.logger.error(
        `Failed to load Prettier plugins for parser ${parser}: ${error.message}`,
      );
      return [];
    }
  }

  // Image Processing

  /**
   * Converts an image file to an SVG using sharp for resizing/thresholding and potrace for vectorization.
   * @param imagePath The path to the input image file.
   * @param color The SVG fill color (e.g., '#000000').
   * @param width Desired width for resizing.
   * @param height Desired height for resizing.
   * @returns An object containing the generated SVG string and its saved file path.
   */
  async convertToSvg(
    imagePath: string, // Renamed from filePath to imagePath for clarity
    color: string,
    width?: number, // Changed to number, as controller now parses it
    height?: number, // Changed to number, as controller now parses it
  ): Promise<{ svg: string; filePath: string }> {
    let tempPngPath: string | undefined;
    try {
      // Ensure imagePath exists and is readable
      if (!fs.existsSync(imagePath)) {
        throw new BadRequestException(
          `Input image file not found: ${imagePath}`,
        );
      }

      tempPngPath = this.getTempPngPath(imagePath); // Use imagePath

      // Sharp for resizing and thresholding
      let sharpPipeline = sharp(imagePath);
      if (width && height) {
        sharpPipeline = sharpPipeline.resize(width, height);
      } else if (width) {
        sharpPipeline = sharpPipeline.resize(width); // Resize by width, auto-height
      } else if (height) {
        sharpPipeline = sharpPipeline.resize(undefined, height); // Resize by height, auto-width
      }

      // Ensure output is PNG for Potrace
      await sharpPipeline
        .threshold(128) // Apply thresholding
        .toFile(tempPngPath);

      // Potrace for vectorization
      const tracer = new potrace.Potrace({
        threshold: 128,
        color: color,
        optTolerance: 0.4,
        background: 'transparent',
      });

      const svg: string = await new Promise((resolve, reject) => {
        // Use .bind(tracer) to ensure `this` context inside the callback refers to the tracer instance
        tracer.loadImage(
          tempPngPath,
          function (err: Error) {
            if (err) {
              this.logger.error(
                `Potrace loadImage failed: ${err.message}`,
                err.stack,
              );
              return reject(
                new InternalServerErrorException(
                  `Potrace failed to load image: ${err.message}`,
                ),
              );
            }
            resolve(this.getSVG());
          }.bind(tracer),
        );
      });

      const svgFilename = `svg-${Date.now()}.svg`;
      const svgPath = path.join(this.outputDir, svgFilename);
      await fs.promises.writeFile(svgPath, svg, 'utf-8');

      return { svg, filePath: svgPath };
    } catch (error) {
      this.logger.error(
        `Image to SVG conversion failed for file "${imagePath}": ${error.message}`,
        error.stack,
      );
      // Re-throw appropriate NestJS exceptions
      if (error instanceof HttpException) {
        throw error;
      }
      throw new InternalServerErrorException(
        `Image to SVG conversion failed: ${error.message}`,
      );
    } finally {
      // Ensure temporary file is always deleted
      if (tempPngPath && fs.existsSync(tempPngPath)) {
        try {
          await fs.promises.unlink(tempPngPath);
        } catch (unlinkError) {
          this.logger.warn(
            `Failed to delete temporary file: ${tempPngPath}. Error: ${unlinkError.message}`,
          );
        }
      }
    }
  }

  // SQL Utilities

  /**
   * Parses basic SELECT SQL queries into a structured JSON object.
   * NOTE: This parser is very basic and not suitable for complex SQL.
   * Consider using a dedicated SQL parsing library for production environments.
   * @param sql The SELECT SQL string.
   * @returns A JSON object representing the parsed SQL.
   * @throws BadRequestException if the SQL syntax is invalid.
   */
  parseSqlToJson(sql: string): {
    type: string;
    table: string;
    columns: string[];
    where: string | null;
  } {
    const selectRegex = /SELECT\s+(.+?)\s+FROM\s+(\w+)(?:\s+WHERE\s+(.+))?/i;
    const match = sql.match(selectRegex);

    if (!match) {
      throw new BadRequestException('Invalid SELECT SQL syntax'); // Use BadRequestException
    }

    const [, columns, table, where] = match;
    return {
      type: 'select',
      table,
      columns: columns.split(',').map((col) => col.trim()),
      where: where ? where.trim() : null,
    };
  }

  /**
   * Parses basic INSERT SQL queries into a structured JSON object.
   * NOTE: This parser is very basic and not suitable for complex SQL.
   * Consider using a dedicated SQL parsing library for production environments.
   * @param sql The INSERT SQL string.
   * @returns A JSON object representing the parsed SQL.
   * @throws BadRequestException if the SQL syntax is invalid or column/value counts mismatch.
   */
  parseInsertSqlToJson(sql: string): {
    type: string;
    table: string;
    data: Record<string, string>;
  } {
    const insertRegex = /INSERT INTO (\w+)\s*\((.+)\)\s*VALUES\s*\((.+)\)/i;
    const match = sql.match(insertRegex);

    if (!match) {
      throw new BadRequestException('Invalid INSERT SQL syntax'); // Use BadRequestException
    }

    const [, table, columns, values] = match;

    const columnList = columns.split(',').map((c) => c.trim());
    const valueList = values
      .split(',')
      .map((v) => v.trim().replace(/^'|'$/g, ''))
      .map((v) => (v === 'NULL' ? null : v)); // Handle NULL values as `null`

    if (columnList.length !== valueList.length) {
      throw new BadRequestException( // Use BadRequestException
        'Column and value counts do not match in INSERT statement',
      );
    }

    const data: Record<string, string> = {};
    columnList.forEach((col, idx) => {
      // FIX: Ensure value is always a string.
      // If valueList[idx] could be null, explicitly convert it to an empty string or handle as 'null' string.
      data[col] = valueList[idx] !== null ? String(valueList[idx]) : 'NULL'; // Convert null to 'NULL' string or ''
    });

    return {
      type: 'insert',
      table,
      data,
    };
  }

  /**
   * Converts a JSON object into a basic INSERT SQL statement.
   * @param input An object containing the table name and data to insert.
   * @returns The generated INSERT SQL string.
   */
  jsonToInsertSql(input: {
    table: string;
    data: Record<string, string | number | boolean | null>;
  }): string {
    const { table, data } = input;
    const columns = Object.keys(data).join(', ');
    const values = Object.values(data)
      .map((v) => {
        if (v === null) return 'NULL';
        if (typeof v === 'string') return `'${v.replace(/'/g, "''")}'`;
        if (typeof v === 'boolean') return v ? 'TRUE' : 'FALSE';
        return v;
      })
      .join(', ');

    return `INSERT INTO ${table} (${columns}) VALUES (${values});`;
  }

  // General Utilities

  /**
   * Capitalizes the first letter of a string.
   * @param text The input string.
   * @returns The capitalized string, or an empty string if input is null/undefined.
   */
  capitalize(text: string): string {
    if (!text) return '';
    return text.charAt(0).toUpperCase() + text.slice(1);
  }

  /**
   * Converts a string to kebab-case.
   * @param text The input string (e.g., 'CamelCaseString' or 'Space Separated String').
   * @returns The kebab-cased string.
   */
  toKebabCase(text: string): string {
    return text
      .replace(/([a-z0-9]|(?=[A-Z]))([A-Z])/g, '$1-$2')
      .replace(/\s+/g, '-')
      .toLowerCase();
  }

  /**
   * Reverses a given string.
   * @param text The input string.
   * @returns The reversed string.
   */
  reverseString(text: string): string {
    return text.split('').reverse().join('');
  }

  /**
   * Truncates a string to a specified maximum length, appending '...' if truncated.
   * @param text The input string.
   * @param maxLength The maximum desired length.
   * @returns The truncated string.
   */
  truncateText(text: string, maxLength: number): string {
    if (text.length <= maxLength) return text;
    return text.slice(0, maxLength) + '...';
  }

  /**
   * Extracts the first H1 or H2 title from a Markdown string.
   * This method supports both `#` (H1) and `##` (H2) for title extraction.
   * @param markdown The Markdown content.
   * @returns The extracted title, or null if no H1 or H2 title is found.
   */
  extractMarkdownTitle(markdown: string): string | null {
    const match = markdown.match(/^#{1,2}\s+(.*)/m); // Changed regex to support H1 or H2
    return match ? match[1].trim() : null;
  }

  /**
   * Returns a new array with unique elements, preserving order of first appearance.
   * @param arr The input array.
   * @returns A new array containing only unique elements.
   */
  uniqueArray<T>(arr: T[]): T[] {
    return [...new Set(arr)];
  }

  // Time Utilities

  /**
   * Formats a duration in milliseconds into a human-readable "time ago" string.
   * @param ms The duration in milliseconds.
   * @returns A string like "just now", "5 minutes ago", "2 days ago".
   */
  timeAgo(ms: number): string {
    const formatter = new Intl.RelativeTimeFormat('en', { numeric: 'auto' });
    const now = Date.now();
    const date = new Date(now - ms);

    const seconds = Math.round((now - date.getTime()) / 1000);
    const minutes = Math.round(seconds / 60);
    const hours = Math.round(minutes / 60);
    const days = Math.round(hours / 24);
    const months = Math.round(days / 30.4375);
    const years = Math.round(days / 365.25);

    if (seconds < 10) {
      return 'just now';
    } else if (seconds < 60) {
      return formatter.format(-seconds, 'second');
    } else if (minutes < 60) {
      return formatter.format(-minutes, 'minute');
    } else if (hours < 24) {
      return formatter.format(-hours, 'hour');
    } else if (days < 30) {
      return formatter.format(-days, 'day');
    } else if (months < 12) {
      return formatter.format(-months, 'month');
    } else {
      return formatter.format(-years, 'year');
    }
  }

  /**
   * Converts a Date object or date string to a Unix timestamp in seconds.
   * @param date The Date object or a date string.
   * @returns Unix timestamp in seconds.
   * @throws BadRequestException if the date format is invalid.
   */
  toUnixSeconds(date: Date | string): number {
    const d = typeof date === 'string' ? new Date(date) : date;
    if (isNaN(d.getTime())) {
      throw new BadRequestException('Invalid date provided to toUnixSeconds'); // Use BadRequestException
    }
    return Math.floor(d.getTime() / 1000);
  }

  /**
   * Parses a duration string (e.g., "1d", "3h", "15m", "30s") into milliseconds.
   * @param duration The duration string.
   * @returns The duration in milliseconds.
   * @throws BadRequestException if the duration format is invalid.
   */
  parseDurationToMs(duration: string): number {
    const match = duration.match(/^(\d+)([dhms])$/);
    if (!match) {
      throw new BadRequestException( // Use BadRequestException
        'Invalid duration format. Expected format: e.g., "1d", "3h", "15m", "30s".',
      );
    }

    const [_, amountStr, unit] = match;
    const amount = parseInt(amountStr, 10);

    switch (unit) {
      case 'd':
        return amount * 24 * 60 * 60 * 1000;
      case 'h':
        return amount * 60 * 60 * 1000;
      case 'm':
        return amount * 60 * 1000;
      case 's':
        return amount * 1000;
      default:
        throw new InternalServerErrorException(
          'Unknown time unit provided to parseDurationToMs.',
        );
    }
  }

  /**
   * Formats a Unix timestamp (in seconds) into a localized date/time string (UTC).
   * @param timestamp Unix timestamp in seconds.
   * @returns Formatted date and time string.
   */
  formatUnixTimestamp(timestamp: number): string {
    const date = new Date(timestamp * 1000);
    return date.toLocaleString('en-US', {
      timeZone: 'UTC',
      year: 'numeric',
      month: 'short',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
  }

  // .ENV File Utilities

  /**
   * Parses a .env file content string into a key-value object.
   * Ignores empty lines and lines starting with '#'.
   * Handles quoted values.
   * This uses dotenv.parse for robust parsing.
   * @param content The string content of a .env file.
   * @returns A Record object with environment variables.
   */
  parseEnvToJsonString(content: string): Record<string, string> {
    // This method is essentially a wrapper for dotenv.parse,
    // which is more robust than a custom regex.
    return dotenv.parse(content);
  }

  /**
   * Parses an uploaded .env file or a file from a specified filepath.
   * Uses `dotenv.parse` for more robust parsing.
   * @param file Optional: An uploaded file (Express.Multer.File).
   * @param filepath Optional: A string path to the .env file.
   * @returns An object containing the source filepath and the parsed data.
   * @throws BadRequestException if inputs are invalid or file operations fail.
   */
  async parseEnvFile(
    file?: Express.Multer.File,
    filepath?: string,
  ): Promise<{ filepath: string; data: Record<string, string> }> {
    if ((file && filepath) || (!file && !filepath)) {
      throw new BadRequestException(
        'Provide exactly one of either an uploaded file or a filepath.',
      );
    }

    let content: string;
    let sourcePath: string;

    if (file) {
      content = file.buffer.toString('utf-8');
      sourcePath = file.originalname;
    } else {
      const resolvedPath = path.resolve(filepath as string);
      try {
        content = await fs.promises.readFile(resolvedPath, 'utf-8');
        sourcePath = resolvedPath;
      } catch (err) {
        this.logger.error(
          `Failed to read file at path: ${resolvedPath}`,
          err.stack,
        );
        throw new BadRequestException(
          `Failed to read file at path: ${filepath}. Make sure it's accessible and correct.`,
        );
      }
    }

    try {
      const parsed = dotenv.parse(content);
      return { filepath: sourcePath, data: parsed };
    } catch (err) {
      this.logger.error(
        `Failed to parse .env file content: ${err.message}`,
        err.stack,
      );
      throw new BadRequestException(
        'Failed to parse .env file. Ensure it is a valid .env format.',
      );
    }
  }

  // Markdown Processing

  /**
   * Converts Markdown content to a Markdown Abstract Syntax Tree (MDAST) in JSON format.
   * @param markdown The Markdown string.
   * @returns The MDAST Root object.
   */
  async markdownToJson(markdown: string): Promise<Root> {
    const processor = unified().use(remarkParse);
    const tree = processor.parse(markdown);
    return tree;
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
      await this.loadGlobalCss(); // Ensure CSS is loaded
    }

    const file = await unified()
      .use(remarkParse)
      .use(remarkRehype)
      .use(rehypeStringify)
      .process(markdown);

    return `<style>${this.globalCssContent || ''}</style><div class="markdown-body">${String(file)}</div>`;
  }
}
