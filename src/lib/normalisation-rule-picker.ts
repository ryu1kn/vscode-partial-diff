import * as vscode from 'vscode';
import {QuickPickItem} from 'vscode';
import {LoadedNormalisationRule} from './entities/normalisation-rule';

interface NormalisationRuleQuickPickItem extends QuickPickItem {
    picked: boolean;
    ruleIndex: number;
}

export default class NormalisationRulePicker {
    private vscWindow: typeof vscode.window;

    constructor(vscWindow: typeof vscode.window) {
        this.vscWindow = vscWindow;
    }

    async show(rules: LoadedNormalisationRule[]) {
        const items = this.convertToQuickPickItems(rules);

        // @ts-ignore
        const userSelection = await this.vscWindow.showQuickPick(items, {canPickMany: true});

        const activeItems = userSelection || items.filter(item => item.picked);
        return this.convertToRules(activeItems);
    }

    private convertToQuickPickItems(rules: LoadedNormalisationRule[]): NormalisationRuleQuickPickItem[] {
        return rules.map((rule, index) => ({
            label: rule.name || '(no "name" set for this rule)',
            picked: rule.active,
            ruleIndex: index,
            description: ''
        }));
    }

    private convertToRules(pickedItems: NormalisationRuleQuickPickItem[]) {
        return pickedItems.map(pickedItem => pickedItem.ruleIndex);
    }
}
