import * as vscode from 'vscode';
import { TranslationService } from '../services/translationService';

export class InlayHintsProvider implements vscode.InlayHintsProvider {
    // Regex patterns to match localization keys
    private readonly templateKeyPattern = /\{#(LNG_\d+|LKP_\d+)#\}/g;
    private readonly phpMethodPattern = /\$this->cLang\(['"]([A-Z_]+\d*)['"][\),]/g;

    constructor(private translationService: TranslationService) {}

    provideInlayHints(
        document: vscode.TextDocument,
        range: vscode.Range,
        token: vscode.CancellationToken
    ): vscode.ProviderResult<vscode.InlayHint[]> {
        const config = vscode.workspace.getConfiguration('phpI18n');
        
        // Check if inline hints are enabled
        if (!config.get<boolean>('enableInlineHints', true)) {
            return [];
        }

        const hints: vscode.InlayHint[] = [];
        const text = document.getText(range);
        const displayLang = config.get<string>('displayLanguage', 'en');

        // Find all template-style keys: {#LNG_2964#}
        let match;
        this.templateKeyPattern.lastIndex = 0;
        while ((match = this.templateKeyPattern.exec(text)) !== null) {
            const key = match[1]; // LNG_2964 or LKP_5822
            const translation = this.translationService.getTranslation(key);

            if (translation) {
                const startPos = document.positionAt(range.start.character + match.index + match[0].length);
                const hint = this.createInlayHint(startPos, translation, displayLang);
                if (hint) {
                    hints.push(hint);
                }
            }
        }

        // Find all PHP method calls: $this->cLang('LNG_2964')
        this.phpMethodPattern.lastIndex = 0;
        while ((match = this.phpMethodPattern.exec(text)) !== null) {
            const key = match[1]; // LNG_15984, SUCCESS, etc.
            
            // Only process LNG_ and LKP_ keys
            if (key.startsWith('LNG_') || key.startsWith('LKP_')) {
                const translation = this.translationService.getTranslation(key);

                if (translation) {
                    const startPos = document.positionAt(range.start.character + match.index + match[0].length);
                    const hint = this.createInlayHint(startPos, translation, displayLang);
                    if (hint) {
                        hints.push(hint);
                    }
                }
            }
        }

        return hints;
    }

    private createInlayHint(
        position: vscode.Position,
        translation: any,
        displayLang: string
    ): vscode.InlayHint | null {
        let label = '';

        switch (displayLang) {
            case 'en':
                label = translation.en ? ` 💬 ${translation.en}` : '';
                break;
            case 'ar':
                label = translation.ar ? ` 💬 ${translation.ar}` : '';
                break;
            case 'both':
                const parts = [];
                if (translation.en) parts.push(translation.en);
                if (translation.ar) parts.push(translation.ar);
                label = parts.length > 0 ? ` 💬 ${parts.join(' / ')}` : '';
                break;
        }

        if (!label) {
            return null;
        }

        const hint = new vscode.InlayHint(
            position,
            label,
            vscode.InlayHintKind.Parameter
        );

        hint.paddingLeft = true;
        
        return hint;
    }
}
