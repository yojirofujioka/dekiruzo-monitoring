// CSVパーサー - 実際のデータ形式に対応
class CSVParser {
    constructor() {
        this.delimiter = '\t'; // タブ区切り
    }

    // CSVデータをパース
    parseCSV(csvText) {
        const lines = csvText.trim().split('\n');
        const headers = this.parseLine(lines[0]);
        const data = [];

        // ヘッダー行と合計行をスキップ
        for (let i = 2; i < lines.length; i++) {
            const values = this.parseLine(lines[i]);
            if (values.length === headers.length && values[0] !== '') {
                const row = {};
                headers.forEach((header, index) => {
                    row[header] = values[index];
                });
                data.push(this.convertRow(row));
            }
        }

        return data;
    }

    // 1行をパース
    parseLine(line) {
        return line.split(this.delimiter).map(val => val.trim());
    }

    // データ型を変換
    convertRow(row) {
        return {
            projectNo: row['物件No'],
            accountingProjectNo: row['経理用物件NO'],
            customerNo: row['顧客番号'],
            accountingCustomerNo: row['経理用顧客番号'],
            customer: row['受注先'],
            projectName: row['物件名'],
            content: row['内容'],
            workType: row['工事区分'],
            supervisorCode: row['担当者コード'],
            supervisor: row['担当'],
            status: row['確認'],
            billingDate: this.parseDate(row['請求日']),
            billingAmount: this.parseAmount(row['請求額']),
            contractAmount: this.parseAmount(row['契約額']),
            receivedAmount: this.parseAmount(row['入金額']),
            offsetAmount: this.parseAmount(row['相殺額']),
            backOffset: this.parseAmount(row['ﾊﾞｯｸ相殺']),
            discount: this.parseAmount(row['値引']),
            transferFee: this.parseAmount(row['振込料']),
            grossProfit: this.parseAmount(row['粗利額']),
            profitRate: this.parseProfitRate(row['利益']),
            backTo: row['ﾊﾞｯｸ先'],
            backAmount: this.parseAmount(row['ﾊﾞｯｸ額']),
            paidAmount: this.parseAmount(row['支払額']),
            unpaidAmount: this.parseAmount(row['未払額']),
            backDate: this.parseDate(row['ﾊﾞｯｸ日']),
            offset: row['相殺'],
            backComplete: row['ﾊﾞｯｸ完了'],
            expectedPaymentDate: this.parseDate(row['入金予定日']),
            paymentDate: this.parseDate(row['入金日']),
            paymentComplete: row['入金完了'],
            contractAmountExcludingTax: this.parseAmount(row['税抜契約金額']),
            consumptionTax: this.parseAmount(row['実質消費税']),
            costAmountExcludingTax: this.parseAmount(row['原価金額(税抜)']),
            expenseAmountExcludingTax: this.parseAmount(row['経費金額(税抜)']),
            nonQualifiedInvoice: this.parseAmount(row['インボイス非適格請求分']),
            relatedProjectNo: row['同一工事物件No']
        };
    }

    // 金額をパース（カンマ除去、数値変換）
    parseAmount(value) {
        if (!value || value === '' || value === '#VALUE!') return 0;
        return parseInt(value.toString().replace(/,/g, '')) || 0;
    }

    // 利益率をパース（10で割って%に）
    parseProfitRate(value) {
        if (!value || value === '' || value === '#VALUE!') return 0;
        const num = parseFloat(value);
        return isNaN(num) ? 0 : num / 10;
    }

    // 日付をパース
    parseDate(value) {
        if (!value || value === '') return null;
        // YYYY/M/D形式をDate型に変換
        const parts = value.split('/');
        if (parts.length === 3) {
            return new Date(parts[0], parts[1] - 1, parts[2]);
        }
        return null;
    }

    // PROJECT_DATA形式に変換
    convertToProjectData(parsedData) {
        return parsedData.map(row => ({
            projectNo: row.projectNo,
            customerNo: row.customerNo,
            customer: row.customer,
            projectName: row.projectName,
            content: row.content,
            workType: row.workType,
            supervisorCode: row.supervisorCode,
            supervisor: row.supervisor,
            contractAmount: row.contractAmount,
            costAmount: row.costAmountExcludingTax,
            profitAmount: row.grossProfit,
            profitRate: row.profitRate,
            status: this.mapStatus(row.paymentComplete),
            billingDate: row.billingDate ? row.billingDate.toISOString().split('T')[0] : '',
            completionDate: row.paymentDate ? row.paymentDate.toISOString().split('T')[0] : ''
        }));
    }

    // ステータスをマッピング
    mapStatus(paymentComplete) {
        if (paymentComplete === '完了') return '完了';
        if (paymentComplete === '') return '進行中';
        return '照合待ち';
    }

    // 見積もりデータの抽出（仮実装）
    extractEstimateData(parsedData) {
        // 実際の見積もりデータは別のシートやファイルから取得する必要がある
        // ここでは物件名から推測する仮実装
        const estimates = [];
        
        parsedData.forEach(row => {
            if (row.workType === 'ﾘﾉﾍﾞｰｼｮﾝ' && row.contractAmount > 3000000) {
                estimates.push({
                    projectNo: row.projectNo,
                    supervisor: row.supervisor,
                    items: this.generateEstimateItems(row)
                });
            }
        });
        
        return estimates;
    }

    // 見積もり項目を生成（仮実装）
    generateEstimateItems(row) {
        const items = [];
        const total = row.contractAmount;
        
        if (row.supervisor === '岡田') {
            items.push(
                { category: 'キッチン', description: 'キッチン推薦', amount: Math.floor(total * 0.3), note: '岡田式' },
                { category: 'バス', description: 'ユニットバス標準', amount: Math.floor(total * 0.25), note: '' },
                { category: '内装', description: '内装工事一式', amount: Math.floor(total * 0.2), note: '' }
            );
        } else if (row.supervisor === '岡野') {
            items.push(
                { category: 'キッチン', description: 'KT-Premium', amount: Math.floor(total * 0.35), note: '高級仕様' },
                { category: 'バス', description: 'UB-1616', amount: Math.floor(total * 0.25), note: '' }
            );
        } else if (row.supervisor === '田原') {
            items.push(
                { category: '水廻り', description: '水廻り4点セット', amount: Math.floor(total * 0.5), note: 'まとめて計上' },
                { category: '内装', description: '内装工事一式', amount: Math.floor(total * 0.3), note: '' }
            );
        }
        
        return items;
    }
}

// グローバルに公開
window.CSVParser = CSVParser; 