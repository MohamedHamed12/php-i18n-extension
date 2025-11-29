import * as vscode from 'vscode';
import { TranslationService, Translation } from '../services/translationService';

export class HoverProvider implements vscode.HoverProvider {
    // Regex patterns to match localization keys
    private readonly templateKeyPattern = /\{#(LNG_\d+|LKP_\d+)#\}/;
    private readonly phpMethodPattern = /\$this->cLang\(['"]([A-Z_]+\d*)['"][\),]/;

    constructor(private translationService: TranslationService) {}

    provideHover(
        document: vscode.TextDocument,
        position: vscode.Position,
        token: vscode.CancellationToken
    ): vscode.ProviderResult<vscode.Hover> {
        const config = vscode.workspace.getConfiguration('phpI18n');
        
        // Check if hover tooltips are enabled
        if (!config.get<boolean>('enableHoverTooltips', true)) {
            return null;
        }

        const range = document.getWordRangeAtPosition(position, /\{#[A-Z_\d]+#\}|\$this->cLang\(['"][A-Z_\d]+['"][\),]/);
        if (!range) {
            return null;
        }

        const text = document.getText(range);
        let key: string | null = null;

        // Try to extract key from template pattern
        const templateMatch = this.templateKeyPattern.exec(text);
        if (templateMatch) {
            key = templateMatch[1];
        } else {
            // Try to extract key from PHP method pattern
            const phpMatch = this.phpMethodPattern.exec(text);
            if (phpMatch && (phpMatch[1].startsWith('LNG_') || phpMatch[1].startsWith('LKP_'))) {
                key = phpMatch[1];
            }
        }

        if (!key) {
            return null;
        }

        const translation = this.translationService.getTranslation(key);
        if (!translation) {
            return new vscode.Hover(
                new vscode.MarkdownString(`**${key}**\n\n⚠️ Translation not found`)
            );
        }

        return new vscode.Hover(this.createHoverContent(translation));
    }

    private createHoverContent(translation: Translation): vscode.MarkdownString {
        const md = new vscode.MarkdownString();
        md.supportHtml = true;
        md.isTrusted = true;

        // Title
        md.appendMarkdown(`### 🌐 ${translation.key}\n\n`);

        // Translations
        md.appendMarkdown(`---\n\n`);
        
        if (translation.en) {
            md.appendMarkdown(`**English:** ${translation.en}\n\n`);
        }
        
        if (translation.ar) {
            md.appendMarkdown(`**العربية:** ${translation.ar}\n\n`);
        }

        if (!translation.en && !translation.ar) {
            md.appendMarkdown(`⚠️ *No translations available*\n\n`);
        }

        // Metadata
        md.appendMarkdown(`---\n\n`);
        
        if (translation.module) {
            md.appendMarkdown(`**Module:** \`${translation.module}\`\n\n`);
        }
        
        if (translation.section) {
            md.appendMarkdown(`**Section:** \`${translation.section}\`\n\n`);
        }

        if (translation.filePath) {
            md.appendMarkdown(`**File:** \`${translation.filePath}\`\n\n`);
        }

        return md;
    }
}
