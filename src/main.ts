import {validateAndFix} from "./utils/validator";

const sampleInvalidJson={
    invoiceNumber: "INV-001",
    buyerTin: "",
    quantity: "10",
    unitPrice: "5",
    lineAmount: "60"
};

const sampleValidJson={
    invoiceNumber: "INV-001",
    buyerTin: "123456789",
    quantity: "10",
    unitPrice: "5",
    lineAmount: "50"
};

const jsonInput = document.getElementById("jsonInput") as HTMLTextAreaElement;
const buttonValidate = document.getElementById("buttonValidate") as HTMLButtonElement;
const statusOutput = document.getElementById("statusOutput") as HTMLDivElement;
const diffOutput = document.getElementById("diffOutput") as HTMLDivElement;
const fixedPre = document.getElementById("FixedPre") as HTMLPreElement;
const originalPre = document.getElementById("OriginalPre") as HTMLPreElement;

function generateDiffHtml(originalObj: any, fixedObj: any): { origHtml: any; fixedHtml: any } {
    const keys =Array.from(new Set([...Object.keys(originalObj), ...Object.keys(fixedObj)]));
    let originalLines: string[] = [];
    let fixedLines: string[] = [];

    keys.forEach(key => {
        const hasOrig = key in originalObj;
        const hasFixed = key in fixedObj;
        const origValue = JSON.stringify(originalObj[key]);
        const fixedValue = JSON.stringify(fixedObj[key]);

        if (hasOrig && hasFixed) {
            if (origValue === fixedValue) {
                originalLines.push(` "${key}: ${origValue}"`);
                fixedLines.push(` "${key}: ${fixedValue}"`);
            } else {
                originalLines.push(` <span class="diff-removed">"${key}": ${origValue}"</span>`);
                fixedLines.push(` <span class="diff-added">"${key}": ${fixedValue}"</span>`);
            }
        }else if (hasOrig && !hasFixed) {
                originalLines.push(` <span class="diff-removed">"${key}": ${origValue}"</span>`);
            }
        else if (!hasOrig && hasFixed) {
                fixedLines.push(` <span class="diff-added">"${key}": ${fixedValue}"</span>`);
            }
        });
        return {
            origHtml: originalLines.join(",<br>"),
            fixedHtml: fixedLines.join(",<br>")
        }
    };

buttonValidate.addEventListener("click", () => {
    statusOutput.innerHTML = "";
    diffOutput.style.display = "none";

    let parsed: any;
    try {
        parsed = JSON.parse(jsonInput.value);
    } catch (err) {
        statusOutput.innerHTML = '<div style="color: red;">Invalid JSON format</div>';
        return;
    }

    const result = validateAndFix(parsed);

    if (result.isValid) {
        statusOutput.innerHTML = '<div style="color: green;">JSON is valid</div>';
        diffOutput.style.display = "none";
    } else {
        let html = '<div style="color: red;">Errors found:</div><ul>';
        result.errors.forEach((err) => {
            html += `<li><strong>${err.path}:</strong> ${err.message}</li>`;
        });
        html += '</ul>';
        statusOutput.innerHTML = html;

        const{origHtml, fixedHtml}=generateDiffHtml(result.originalJson, result.fixedJson);
        originalPre.innerHTML = origHtml;
        fixedPre.innerHTML = fixedHtml;
        diffOutput.style.display = "flex";
    }
});

jsonInput.value = JSON.stringify(sampleInvalidJson, null, 2);