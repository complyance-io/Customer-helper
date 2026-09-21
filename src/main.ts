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
    } else {
        let html = '<div style="color: red;">Errors found:</div><ul>';
        result.errors.forEach((err) => {
            html += `<li><strong>${err.path}:</strong> ${err.message}</li>`;
        });
        html += '</ul>';
        statusOutput.innerHTML = html;
    }

    originalPre.textContent = JSON.stringify(result.originalJson, null, 2);
    fixedPre.textContent = JSON.stringify(result.fixedJson, null, 2);
    diffOutput.style.display = "flex";
});

jsonInput.value = JSON.stringify(sampleInvalidJson, null, 2);