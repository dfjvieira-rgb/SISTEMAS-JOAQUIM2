// folha-engine.js - VERSÃO QUEBRA ANTECIPADA [2026-02-01]
export const FolhaEngine = {
    // Reduzi drasticamente para 62 para garantir recuo visual seguro
    LIMITE_OAB: 62, 

    montar: (containerId, limite) => {
        const container = document.getElementById(containerId);
        if (!container) return;
        container.innerHTML = "";
        
        // Força o limite em 62 independente do que venha no parâmetro
        FolhaEngine.LIMITE_OAB = 62; 

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
                }
                .linha-folha {
                    flex: 1;
                    border: none;
                    outline: none;
                    background: transparent !important;
                    padding: 0 15px;
                    /* BLOQUEIO FÍSICO: Aumentado para 90px para empurrar o texto */
                    padding-right: 90px !important; 
                    font-size: 19px !important;
                    font-family: 'Courier New', Courier, monospace !important;
                    font-weight: 700 !important;
                    color: #000000 !important;
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
                <input class="linha-folha" id="L${i}" maxlength="95" 
                       spellcheck="false" autocomplete="off" data-index="${i}"> 
            `;
            container.appendChild(row);

            const input = row.querySelector('input');
            
            input.addEventListener('input', (e) => {
                const value = input.value;
                // Quebra manual na digitação
                if (value.length >= FolhaEngine.LIMITE_OAB && e.inputType !== 'deleteContentBackward') {
                    const ultimoEspaco = value.lastIndexOf(" ");
                    if (ultimoEspaco > 0) {
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
                if (e.key === 'Enter') {
                    e.preventDefault();
                    const next = document.getElementById(`L${i + 1}`);
                    if (next) next.focus();
                }
            });
        }
    },

    formatarParaOAB: (texto) => {
        if (!texto) return "";
        const limpo = texto.replace(/<[^>]*>?/gm, '').trim();
        const minusculo = limpo.toLowerCase();
        return minusculo.charAt(0).toUpperCase() + minusculo.slice(1);
    },

    injetarTextoMultilinhas: (textoBruto, linhaInicial) => {
        let currentLinha = linhaInicial;
        const textoProcessado = FolhaEngine.formatarParaOAB(textoBruto);
        const paragrafos = textoProcessado.split('\n');

        paragrafos.forEach(paragrafo => {
            let palavras = paragrafo.split(' ');
            let linhaTexto = "";

            palavras.forEach(palavra => {
                // Se a palavra atual + o que já tem ultrapassar 62, pula AGORA.
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
