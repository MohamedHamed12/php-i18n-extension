import * as vscode from 'vscode';
import { TranslationService } from './services/translationService';
import { InlayHintsProvider } from './providers/inlayHintsProvider';
import { HoverProvider } from './providers/hoverProvider';

export function activate(context: vscode.ExtensionContext) {
    console.log('PHP i18n Viewer extension is now active');

    // Initialize translation service
    const translationService = new TranslationService();
    
    // Create status bar item for refresh
    const statusBarItem = vscode.window.createStatusBarItem(
        vscode.StatusBarAlignment.Right,
        100
    );
    statusBarItem.text = "$(refresh) Reload Translations";
    statusBarItem.command = 'phpI18n.refreshTranslations';
    statusBarItem.tooltip = 'Reload all i18n translation files';
    statusBarItem.show();
    context.subscriptions.push(statusBarItem);
    
    // Register workspace folder watcher
    const workspaceFolders = vscode.workspace.workspaceFolders;
    if (workspaceFolders) {
        // Load translations from all workspace folders
        translationService.loadTranslations(workspaceFolders[0].uri.fsPath);
        
        // Watch for language file changes
        const watcher = vscode.workspace.createFileSystemWatcher(
            '**/modules/*/view/lang/lang.*.conf'
        );
        
        watcher.onDidChange(() => {
            translationService.clearCache();
            translationService.loadTranslations(workspaceFolders[0].uri.fsPath);
        });
        
        watcher.onDidCreate(() => {
            translationService.clearCache();
            translationService.loadTranslations(workspaceFolders[0].uri.fsPath);
        });
        
        context.subscriptions.push(watcher);
    }

    // Register Inlay Hints Provider for inline translations
    const inlayHintsProvider = new InlayHintsProvider(translationService);
    context.subscriptions.push(
        vscode.languages.registerInlayHintsProvider(
            [
                { scheme: 'file', pattern: '**/*.tpl' },
                { scheme: 'file', pattern: '**/*.php' },
                { scheme: 'file', pattern: '**/*.html' }
            ],
            inlayHintsProvider
        )
    );

    // Register Hover Provider for detailed tooltips
    const hoverProvider = new HoverProvider(translationService);
    context.subscriptions.push(
        vscode.languages.registerHoverProvider(
            [
                { scheme: 'file', pattern: '**/*.tpl' },
                { scheme: 'file', pattern: '**/*.php' },
                { scheme: 'file', pattern: '**/*.html' }
            ],
            hoverProvider
        )
    );

    // Refresh command
    const refreshCommand = vscode.commands.registerCommand(
        'phpI18n.refreshTranslations',
        () => {
            translationService.clearCache();
            if (workspaceFolders) {
                translationService.loadTranslations(workspaceFolders[0].uri.fsPath);
                const count = translationService.getTranslationsCount();
                if (count > 0) {
                    vscode.window.showInformationMessage(`Translations refreshed: ${count} keys loaded`);
                } else {
                    vscode.window.showWarningMessage(
                        `No translations found. Check Output panel for details. Expected path: modules/*/view/lang/lang.*.conf`,
                        'View Output'
                    ).then(selection => {
                        if (selection === 'View Output') {
                            vscode.commands.executeCommand('workbench.action.output.toggleOutput');
                        }
                    });
                }
            } else {
                vscode.window.showWarningMessage('No workspace folder found');
            }
        }
    );
    context.subscriptions.push(refreshCommand);
}

export function deactivate() {
    console.log('PHP i18n Viewer extension deactivated');
}
