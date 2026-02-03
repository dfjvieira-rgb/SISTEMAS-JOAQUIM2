// FolhaEngine.js - VERSÃO ABNT LIBERADA [2026-02-02]
export const FolhaEngine = {
    LIMITE_OAB: 75, 

    montar: (containerId) => {
        const container = document.getElementById(containerId);
        if (!container) return;
        container.innerHTML = "";
        
        if (!document.getElementById('style-folha-elite')) {
            const style = document.createElement('style');
            style.id = 'style-folha-elite';
            style.innerHTML = `
                .linha-wrapper { 
                    background: #fff; 
                    border-bottom: 1px solid #d1d5db; 
                    display: flex; 
                    height: 35px; /* Altura padrão para leitura */
                    position: relative;
                }
                /* Régua Visual de Limite OAB */
                .linha-wrapper::after {
                    content: "";
                    position: absolute;
                    right: 85px;
                    top: 0;
                    bottom: 0;
                    width: 1px;
                    background: rgba(255, 0, 0, 0.2);
                    pointer-events: none;
                }
                .linha-num { 
                    width: 45px; 
                    display: flex; 
                    align-items: center; 
                    justify-content: center; 
                    font-size: 0.8rem; 
                    color: #94a3b8; 
                    border-right: 2px solid #cbd5e1; 
                    background: #f8fafc; 
                    user-select: none;
                    font-weight: bold;
                }
                .linha-folha { 
                    flex: 1; 
                    border: none; 
                    outline: none; 
                    padding: 0 15px; 
                    font-size: 19px !important; 
                    font-family: 'Courier New', Courier, monospace !important; 
                    font-weight: 700 !important; 
                    color: #000 !important; 
                    background: transparent;
                    letter-spacing: 0.5px;
                }
                .linha-folha:focus { background: #fffdf0; }
            `;
            document.head.appendChild(style);
        }

        for(let i=1; i<=150; i++) {
            const row = document.createElement('div');
            row.className = 'linha-wrapper';
            row.innerHTML = `<div class="linha-num">${i}</div>
                <input class="linha-folha" id="L${i}" data-index="${i}" spellcheck="false" autocomplete="off">`;
            container.appendChild(row);

            const input = row.querySelector('input');

            // --- MAPEAMENTO DE TECLAS LIBERADAS ---
            input.addEventListener('keydown', function(e) {
                const idx = parseInt(this.getAttribute('data-index'));
                const proximo = document.getElementById(`L${idx + 1}`);
                const anterior = document.getElementById(`L${idx - 1}`);

                // 1. TAB LIBERADO: Insere 4 espaços (Parágrafo)
                if (e.key === 'Tab') {
                    e.preventDefault(); 
                    const start = this.selectionStart;
                    this.value = this.value.substring(0, start) + "    " + this.value.substring(this.selectionEnd);
                    this.selectionStart = this.selectionEnd = start + 4;
                }

                // 2. ENTER LIBERADO: Pula para a linha de baixo
                if (e.key === 'Enter') {
                    e.preventDefault();
                    if (proximo) proximo.focus();
                }

                // 3. SETAS LIBERADAS: Navegação vertical
                if (e.key === 'ArrowUp') {
                    e.preventDefault();
                    if (anterior) anterior.focus();
                }
                if (e.key === 'ArrowDown') {
                    e.preventDefault();
                    if (proximo) proximo.focus();
                }

                // 4. BACKSPACE INTELIGENTE: Volta linha se estiver no início
                if (e.key === 'Backspace' && this.selectionStart === 0 && this.value === '') {
                    if (anterior) {
                        e.preventDefault();
                        anterior.focus();
                        anterior.setSelectionRange(anterior.value.length, anterior.value.length);
                    }
                }
            });
        }
    },

    injetarTextoMultilinhas: (textoBruto, linhaInicial) => {
        if (!textoBruto) return;
        let currentLinha = linhaInicial;
        // Limpa tags e quebra por parágrafos reais
        const textoProcessado = textoBruto.replace(/<[^>]*>?/gm, '').split('\n');

        textoProcessado.forEach(paragrafo => {
            let palavras = paragrafo.split(' ');
            let acumulador = "";
            palavras.forEach(p => {
                if ((acumulador + p).length > 70) { 
                    const el = document.getElementById(`L${currentLinha}`);
                    if (el) el.value = acumulador.trim();
                    currentLinha++;
                    acumulador = p + " ";
                } else {
                    acumulador += p + " ";
                }
            });
            const elFinal = document.getElementById(`L${currentLinha}`);
            if (elFinal) elFinal.value = acumulador.trim();
            currentLinha++;
        });
    }
};
