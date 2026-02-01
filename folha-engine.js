// folha-engine.js - VERSÃO ESTÉTICA OAB FINAL [2026-02-01]
// AJUSTES: Recuo de segurança (68 chars) e Formatação de Sentença (Sentence Case)
export const FolhaEngine = {
    // Reduzido para 68 para garantir que nunca encoste na linha vermelha
    LIMITE_OAB: 68, 

    montar: (containerId, limite) => {
        const container = document.getElementById(containerId);
        if (!container) return;
        container.innerHTML = "";
        
        // Calibragem de segurança
        FolhaEngine.LIMITE_OAB = (limite || 75) - 7;

        if (!document.getElementById('style-folha-elite')) {
            const style = document.createElement('style');
            style.id = 'style-folha-elite';
            style.innerHTML = `
                .linha-wrapper {
                    background: #ffffff;
                    border-bottom: 1px solid #d1d5db;
                    position: relative;
                    display: flex;
                    height: 35px;
                }
                .linha-wrapper::after {
                    content: "";
                    position: absolute;
                    right: 60px;
                    top: 0;
                    bottom: 0;
                    width: 2px;
                    background: rgba(239, 68, 68, 0.4);
                    pointer-events: none;
                }
                .linha-num {
                    width: 40px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 0.7rem;
                    color: #94a3b8;
                    border-right: 1px solid #d1d5db;
                    background: #f8fafc;
                    user-select: none;
                }
                .linha-folha {
                    flex: 1;
                    border: none;
                    outline: none;
                    background: transparent !important;
                    padding: 0 15px;
                    /* Padding largo para criar barreira física na margem */
                    padding-right: 80px !important; 
                    font-size: 19px !important;
                    font-family: 'Courier New', Courier, monospace !important;
                    font-weight: 700 !important;
                    color: #000000 !important;
                    /* Removido o Uppercase forçado */
                    height: 100%;
                    box-sizing: border-box;
                    letter-spacing: 0.5px;
                }
            `;
            document.head.appendChild(style);
        }

        for(let i=1; i<=150; i++) {
            const row = document.createElement('div');
            row.className = 'linha-wrapper';
            row.innerHTML = `
                <div class="linha-num">${i}</div>
                <input class="linha-folha" id="L${i}" maxlength="90" 
                       spellcheck="false" autocomplete="off" data-index="${i}"> 
            `;
            container.appendChild(row);

            const input = row.querySelector('input');
            
            input.addEventListener('input', (e) => {
                const value = input.value;
                if (value.length >= FolhaEngine.LIMITE_OAB && e.inputType !== 'deleteContentBackward') {
                    const ultimoEspaco = value.lastIndexOf(" ");
                    if (ultimoEspaco > (FolhaEngine.LIMITE_OAB * 0.5)) {
                        const textoFica = value.substring(0, ultimoEspaco);
                        const textoPula = value.substring(ultimoEspaco).trim();
                        const next = document.getElementById(`L${i + 1}`);
                        if (next) {
                            input.value = textoFica;
                            next.value = textoPula + (next.value ? " " + next.value : "");
                            next.focus();
                        }
                    }
                }
            });

            input.addEventListener('keydown', (e) => {
                if (e.code === 'Space' && input.value === "  ") {
                    e.preventDefault();
                    input.value = "          ";
                }
                if (e.key === 'Backspace' && input.value === "" && i > 1) {
                    const prev = document.getElementById(`L${i - 1}`);
                    if (prev) { e.preventDefault(); prev.focus(); }
                }
                if (e.key === 'Enter') {
                    e.preventDefault();
                    const next = document.getElementById(`L${i + 1}`);
                    if (next) next.focus();
                }
            });
        }
    },

    // Formata o texto para "Padrão de petição" (Primeira maiúscula, resto minúscula)
    formatarParaOAB: (texto) => {
        if (!texto) return "";
        // Remove tags HTML se houver
        const limpo = texto.replace(/<[^>]*>?/gm, '').trim();
        const minusculo = limpo.toLowerCase();
        return minusculo.charAt(0).toUpperCase() + minusculo.slice(1);
    },

    injetarTextoMultilinhas: (textoBruto, linhaInicial) => {
        let currentLinha = linhaInicial;
        
        // Aplica a formatação estética
        const textoProcessado = FolhaEngine.formatarParaOAB(textoBruto);
        const paragrafos = textoProcessado.split('\n');

        paragrafos.forEach(paragrafo => {
            let palavras = paragrafo.split(' ');
            let linhaTexto = "";

            palavras.forEach(palavra => {
                if ((linhaTexto + palavra).length > FolhaEngine.LIMITE_OAB) {
                    const el = document.getElementById(`L${currentLinha}`);
                    if (el) el.value = linhaTexto.trim();
                    currentLinha++;
                    linhaTexto = palavra + " ";
                } else {
                    linhaTexto += palavra + " ";
                }
            });

            const elFinal = document.getElementById(`L${currentLinha}`);
            if (elFinal) elFinal.value = linhaTexto.trim();
            currentLinha++; 
        });
    }
};
