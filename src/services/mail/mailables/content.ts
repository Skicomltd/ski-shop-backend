import { join } from "path"
import handlebars from "handlebars"
import { existsSync, readFileSync, readdirSync } from "fs"

/**
 * Shape of content that can be provided for an email
 */
type ContentType = {
  html?: string // view name (e.g., "welcome" or "mail.welcome")
  text?: string // plain text version of the message
  with?: Record<string, any> // data passed into templates
}

/**
 * Represents the body content of an email.
 *
 * Supports either:
 * - A template-based HTML view (compiled with Handlebars),
 * - A plain text message,
 * - Or both.
 */
export class Content {
  public html?: string
  public text?: string
  public with?: Record<string, any>

  /**
   * Default base directory for view templates.
   * Templates are expected to be in `src/views`.
   */
  private readonly viewsPath = join(process.cwd(), "src", "views")

  constructor(data: ContentType) {
    this.html = data.html
    this.text = data.text
    this.with = data.with
  }

  /**
   * Build the email body by compiling HTML templates or returning raw text.
   *
   * - If `html` is provided, it looks for a `.html`, `.hbs`, or `.handlebars` file
   *   under the `views` directory, compiles it with Handlebars, and injects variables.
   * - If `text` is provided, it simply returns it as the plain-text content.
   * - If neither is found, it returns an empty object.
   */
  public build(): { html?: string; text?: string } {
    
    if (this.html) {
      this.registerPartials(this.html)
      const templatePath = this.resolveViewPath(this.html)
      const fileContent = readFileSync(templatePath, "utf8")
      const template = handlebars.compile(fileContent)
      const rendered = template(this.with || {})
      return { html: rendered }
    }

    if (this.text) {
      return { text: this.text }
    }

    return {}
  }

  /**
   * Resolve a template name into a file path.
   *
   * Example:
   *  - "mail.test" → "src/views/mail/test.html" (or .hbs / .handlebars)
   *
   * Tries extensions in order: `.html`, `.hbs`, `.handlebars`.
   * Throws an error if the template file does not exist.
   */
  private resolveViewPath(viewName: string): string {
    const extensions = [".html", ".hbs", ".handlebars"]
    const relativePath = viewName.replace(/\./g, "/");

    for (const ext of extensions) {
      const filePath = join(this.viewsPath, relativePath + ext);
      if (existsSync(filePath)) {
        return filePath
      }
    }

    throw new Error(`Template not found for view: ${viewName}`)
  }

  /**
   * Register Handlebars partials from the mail/partials directory.
   */
  private registerPartials(viewName: string): void {
    const relativePath = viewName.replace(/\./g, "/")
   // Get area prefix (e.g. 'mail' from 'mail/welcome'), or '' for global partials
    const folder = relativePath.includes("/") ? relativePath.split("/")[0] : ""
    const partialsPath = join(this.viewsPath, folder, "partials")
    console.log(partialsPath)
    if (!existsSync(partialsPath)) {
      return
    }

    const files = readdirSync(partialsPath)
    for (const file of files) {
      if (file.endsWith(".hbs") || file.endsWith(".handlebars")) {
        const partialName = file.replace(/\.(hbs|handlebars)$/, "")
        const filePath = join(partialsPath, file)
        const partialContent = readFileSync(filePath, "utf8")
        handlebars.registerPartial(partialName, partialContent)
      }
    }
  }
}
